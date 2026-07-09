import { TRPCError } from "@trpc/server"
import { ZTSponsorshipInput } from "@workspace/types/index"
import { prisma } from "../../../infrastructure/database/prisma"
import { stripe } from "../../../infrastructure/stripe/stripe"
import config from "../../../utils/config"

export class SponsorShipService {
  static async createStripeSponsorship(body: ZTSponsorshipInput) {
    const { amount, currency, email, phone, name, tier, userId, description } =
      body

    let sponsorName = name
    let sponsorEmail = email
    let sponsorPhone = phone

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })
      if (user) {
        sponsorName = user.name
        sponsorEmail = user.email
        sponsorPhone = user.phone ?? phone
      }
    }

    const plan = await prisma.sponsorPlan.findFirst({
      where: {
        tier: tier.toUpperCase() as any,
        isActive: true,
      },
    })
    if (!plan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No active sponsor plan found for tier ${tier}`,
      })
    }

    const sponsor = await prisma.sponsor.upsert({
      where: { email: sponsorEmail },
      update: { name: sponsorName, phone: sponsorPhone ?? undefined },
      create: {
        name: sponsorName,
        email: sponsorEmail,
        phone: sponsorPhone ?? undefined,
      },
    })

    const sponsorship = await prisma.sponsorship.create({
      data: {
        planId: plan.id,
        amount,
        currency: currency.toUpperCase() as "USD" | "EUR",
        status: "PENDING",
        sponsorId: sponsor.id,
        userId: userId ?? null,
      },
    })

    const amountInCents = Math.round(amount * 100)

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: sponsorEmail,
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: `Sponsorship - ${plan.name}`,
                description: description ?? `Sponsorship for ${plan.name}`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${config.frontendUrl}/sponsor/success?tier=${encodeURIComponent(plan.name)}&amount=${amount}&currency=${currency}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.frontendUrl}/sponsor/cancel`,
        invoice_creation: { enabled: true },
        metadata: {
          type: "sponsorship",
          sponsorshipId: sponsorship.id,
          sponsorId: sponsor.id,
          userId: userId ?? "Guest",
          planId: plan.id,
          amount: amount.toString(),
          currency: currency.toUpperCase(),
        },
      })

      await prisma.sponsorship.update({
        where: { id: sponsorship.id },
        data: {
          paymentIntentId: session.id,
        },
      })

      return {
        checkoutUrl: session.url!,
        sponsorshipId: sponsorship.id,
      }
    } catch (error: any) {
      console.error("[Stripe Sponsorship Error]: ", error)
      await prisma.sponsorship
        .delete({ where: { id: sponsorship.id } })
        .catch(() => {})
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to initiate Stripe payment.",
        cause: error,
      })
    }
  }

  static async getSponsorshipHistory(params: { page: number; limit: number }) {
    const { page, limit } = params
    const skip = (page - 1) * limit

    const data = await prisma.sponsorship.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        sponsor: true,
        plan: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            userRoles: {
              select: {
                role: true,
              },
            },
            createdAt: true,
          },
        },
      },
    })
    const totalCount = await prisma.sponsorship.count()

    return { data, totalCount }
  }

  static async deleteSponsorship(id: string) {
    const sponsorship = await prisma.sponsorship.delete({
      where: {
        id,
      },
    })
    if (!sponsorship) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Sponsorship not found",
      })
    }
    return sponsorship
  }


  static async filterSponsorship(params: {
    page: number
    limit: number
    skip: number
    status: string
    search : string
    minAmount : number
    maxAmount: number
    startDate : string
    endDate : string
    tier?: string
    role?: string
  }) {
    const { page, limit, skip, status, search, minAmount, maxAmount, startDate, endDate, tier, role } = params

    const where: any = {}

    // Status Filter
    if (status && status !== "ALL") {
      where.status = status.toUpperCase()
    }

    // Tier Filter (plan tier)
    if (tier && tier !== "ALL") {
      where.plan = {
        tier: tier.toUpperCase() as any
      }
    }

    // Role Filter (user role)
    if (role && role !== "ALL") {
      const dbRoleName = role.toUpperCase() === "GENERAL" ? "MEMBER" : role.toUpperCase();
      where.user = {
        userRoles: {
          some: {
            role: {
              name: dbRoleName
            }
          }
        }
      }
    }

    // Search Filter (Sponsor name, email, phone or userId/sponsorshipId)
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        {
          sponsor: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } }
            ]
          }
        },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } }
            ]
          }
        }
      ]
    }

    // Amount Filter (minAmount, maxAmount)
    if (minAmount !== undefined && minAmount !== null && !isNaN(minAmount)) {
      where.amount = {
        ...where.amount,
        gte: minAmount
      }
    }
    if (maxAmount !== undefined && maxAmount !== null && !isNaN(maxAmount)) {
      where.amount = {
        ...where.amount,
        lte: maxAmount
      }
    }

    // Date Filter (startDate, endDate)
    if (startDate) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(startDate)
      }
    }
    if (endDate) {
      where.createdAt = {
        ...where.createdAt,
        lte: new Date(endDate)
      }
    }

    const offset = skip !== undefined ? skip : (page - 1) * limit

    const [data, totalCount] = await prisma.$transaction([
      prisma.sponsorship.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          sponsor: true,
          plan: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              userRoles: {
                select: {
                  role: true,
                },
              },
              createdAt: true,
            },
          },
        },
      }),
      prisma.sponsorship.count({ where }),
    ])

    return { data, totalCount }
  }


  static async getSponsorStats() {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    const successfulSponsorships = await prisma.sponsorship.findMany({
      where: {
        status: "SUCCEEDED",
      },
      include: {
        plan: true,
      },
    })

    const tiers = ["DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE"]
    const planStats: Record<
      string,
      {
        dailyAmount: number
        monthlyAmount: number
        yearlyAmount: number
        totalAmount: number
        dailyCount: number
        monthlyCount: number
        yearlyCount: number
        totalCount: number
      }
    > = {}

    tiers.forEach((tier) => {
      planStats[tier] = {
        dailyAmount: 0,
        monthlyAmount: 0,
        yearlyAmount: 0,
        totalAmount: 0,
        dailyCount: 0,
        monthlyCount: 0,
        yearlyCount: 0,
        totalCount: 0,
      }
    })

    const totalStats = {
      dailyAmount: 0,
      monthlyAmount: 0,
      yearlyAmount: 0,
      totalAmount: 0,
      dailyCount: 0,
      monthlyCount: 0,
      yearlyCount: 0,
      totalCount: 0,
    }

    successfulSponsorships.forEach((s) => {
      const amount = Number(s.amount)
      const date = s.createdAt
      const tier = s.plan?.tier?.toUpperCase()

      // Update total/overall stats
      totalStats.totalAmount += amount
      totalStats.totalCount += 1
      if (date >= oneDayAgo) {
        totalStats.dailyAmount += amount
        totalStats.dailyCount += 1
      }
      if (date >= oneMonthAgo) {
        totalStats.monthlyAmount += amount
        totalStats.monthlyCount += 1
      }
      if (date >= oneYearAgo) {
        totalStats.yearlyAmount += amount
        totalStats.yearlyCount += 1
      }

      // Update plan stats
      if (tier && planStats[tier]) {
        planStats[tier].totalAmount += amount
        planStats[tier].totalCount += 1
        if (date >= oneDayAgo) {
          planStats[tier].dailyAmount += amount
          planStats[tier].dailyCount += 1
        }
        if (date >= oneMonthAgo) {
          planStats[tier].monthlyAmount += amount
          planStats[tier].monthlyCount += 1
        }
        if (date >= oneYearAgo) {
          planStats[tier].yearlyAmount += amount
          planStats[tier].yearlyCount += 1
        }
      }
    })

    const formattedSponsorPackages = tiers.map((tier) => {
      const stats = planStats[tier] || {
        dailyAmount: 0,
        monthlyAmount: 0,
        yearlyAmount: 0,
        totalAmount: 0,
        dailyCount: 0,
        monthlyCount: 0,
        yearlyCount: 0,
        totalCount: 0,
      }
      let color = "text-orange-600"
      let light = "text-orange-500"

      if (tier === "DIAMOND") {
        color = "text-red-600"
        light = "text-red-500"
      } else if (tier === "PLATINUM") {
        color = "text-slate-900"
        light = "text-slate-600"
      } else if (tier === "GOLD") {
        color = "text-amber-600"
        light = "text-amber-500"
      } else if (tier === "SILVER") {
        color = "text-blue-600"
        light = "text-blue-500"
      }

      return {
        title: tier,
        total: `$${stats.totalAmount.toLocaleString()}`,
        yearly: `$${stats.yearlyAmount.toLocaleString()}`,
        monthly: `$${stats.monthlyAmount.toLocaleString()}`,
        daily: `$${stats.dailyAmount.toLocaleString()}`,
        totalCount: stats.totalCount,
        yearlyCount: stats.yearlyCount,
        monthlyCount: stats.monthlyCount,
        dailyCount: stats.dailyCount,
        color,
        light,
      }
    })

    const formattedTotalSummary = {
      title: "TOTAL SPONSORSHIP REVENUE",
      mainValue: `$${totalStats.totalAmount.toLocaleString()}`,
      lifetime: `$${totalStats.totalAmount.toLocaleString()}`,
      yearly: `$${totalStats.yearlyAmount.toLocaleString()}`,
      monthly: `$${totalStats.monthlyAmount.toLocaleString()}`,
      daily: `$${totalStats.dailyAmount.toLocaleString()}`,
      totalCount: totalStats.totalCount,
      yearlyCount: totalStats.yearlyCount,
      monthlyCount: totalStats.monthlyCount,
      dailyCount: totalStats.dailyCount,
    }

    return {
      totalSummary: formattedTotalSummary,
      sponsorPackages: formattedSponsorPackages,
    }
  }

}
