import { ZTDonationInput } from "@workspace/types/index"
import { prisma } from "../../../infrastructure/database/prisma"
import { TRPCError } from "@trpc/server"
import { stripe } from "../../../infrastructure/stripe/stripe"
import config from "../../../utils/config"
import { Prisma } from "../../../generated/prisma/client"

export class DonationService {
  static async createStripeDonation(body: ZTDonationInput) {
    const {
      amount,
      currency,
      description,
      name,
      email,
      phone,
      userId,
    } = body

    let donorName = name
    let donorEmail = email
    let donorPhone = phone

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })
      if (user) {
        donorName = user.name
        donorEmail = user.email
        donorPhone = user.phone ?? phone
      }
    }

    if (!donorEmail) throw new TRPCError({ code: "BAD_REQUEST", message: "Donor email is required." })

    const donator = await prisma.donator.upsert({
      where: { email: donorEmail },
      update: { name: donorName, phone: donorPhone ?? undefined },
      create: { name: donorName, email: donorEmail, phone: donorPhone ?? undefined },
    })

    const donation = await prisma.donation.create({
      data: {
        amount,
        currency: currency.toUpperCase() as "USD" | "EUR",
        status: "PENDING",
        donatorId: donator.id,
        userId: userId ?? null,
        isAnonymous: body.isAnonymous ?? false,
        message: body.message ?? null,
        metadata: body.metadata ? (body.metadata as Prisma.InputJsonValue) : undefined,
      },
    })

    const amountInCents = Math.round(amount * 100)
    let stripeCustomerId = donator.stripeCustomerId && !donator.stripeCustomerId.startsWith("cus_mock")
      ? donator.stripeCustomerId
      : undefined

    try {
      let session;
      try {
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: stripeCustomerId ? undefined : donorEmail,
          customer: stripeCustomerId ?? undefined,
          line_items: [
            {
              price_data: {
                currency: currency.toLowerCase(),
                product_data: {
                  name: "Donation",
                  description: description ?? "General Donation"
                },
                unit_amount: amountInCents,
              },
              quantity: 1,
            }
          ],
          success_url: `${config.frontendUrl}/donation/success?session_id={CHECKOUT_SESSION_ID}&amount=${amount}&currency=${currency}`,
          cancel_url: `${config.frontendUrl}/donation/cancel`,
          invoice_creation: { enabled: true },
          metadata: {
            type: "donation",
            donationId: donation.id,
            donatorId: donator.id,
            userId: userId ?? "Guest",
            amount: amount.toString(),
            currency: currency.toUpperCase(),
          }
        })
      } catch (stripeErr: any) {
        if (stripeErr.message && stripeErr.message.includes("No such customer") && stripeCustomerId) {
          console.warn(`[Stripe Checkout] Stale customer ID ${stripeCustomerId} detected. Clearing and retrying...`);
          await prisma.donator.update({
            where: { id: donator.id },
            data: { stripeCustomerId: null }
          }).catch(() => {});
          
          session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: donorEmail,
            line_items: [
              {
                price_data: {
                  currency: currency.toLowerCase(),
                  product_data: {
                    name: "Donation",
                    description: description ?? "General Donation"
                  },
                  unit_amount: amountInCents,
                },
                quantity: 1,
              }
            ],
            success_url: `${config.frontendUrl}/donation/success?session_id={CHECKOUT_SESSION_ID}&amount=${amount}&currency=${currency}`,
            cancel_url: `${config.frontendUrl}/donation/cancel`,
            invoice_creation: { enabled: true },
            metadata: {
              type: "donation",
              donationId: donation.id,
              donatorId: donator.id,
              userId: userId ?? "Guest",
              amount: amount.toString(),
              currency: currency.toUpperCase(),
            }
          })
        } else {
          throw stripeErr;
        }
      }

      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          paymentIntentId: session.id,
        }
      })

      return {
        checkoutUrl: session.url!,
        donationId: donation.id,
      }

    } catch (error: any) {
      console.error("[Stripe Checkout Error]: ", error)
      await prisma.donation.delete({ where: { id: donation.id } }).catch(() => {})
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to initiate Stripe payment.",
        cause: error,
      })
    }
  }

  static async getDonationHistory(params: { page: number; limit: number }) {
    const { page, limit } = params
    const skip = (page - 1) * limit

    const data = await prisma.donation.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        donator: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            userRoles: {
              select: {
                role: true
              }
            },
            createdAt: true,
          },
        },
      },
    })
    const totalCount = await prisma.donation.count()

    return { data, totalCount }
  }

  static async getDonationById(id: string) {
    const donation = await prisma.donation.findUnique({
      where: {
        id
      },
      include: {
        donator: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            userRoles: {
              select: {
                role: true
              }
            },
            createdAt: true,
          },
        },
      },
    })
    if (!donation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Donation not found",
      })
    }
    return donation
  }


  static async getDonationByUserId(userId: string) {
    const donations = await prisma.donation.findMany({
      where: {
        userId
      },
      include: {
        donator: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            userRoles: {
              select: {
                role: true
              }
            },
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    if (!donations) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Donation not found",
      })
    }
    return donations
  }


  static async deleteDonation(id: string) {
    const donation = await prisma.donation.delete({
      where: {
        id
      },
    })
    if (!donation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Donation not found",
      })
    }
    return donation
  }

  static async getDonationStats() {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    const allDonations = await prisma.donation.findMany({
      include: {
        user: {
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    })

    interface TimeframeStats {
      dailyAmount: number
      monthlyAmount: number
      yearlyAmount: number
      totalAmount: number
      dailyCount: number
      monthlyCount: number
      yearlyCount: number
      totalCount: number
    }

    const rolesList = ["SUPER_ADMIN", "BOARD", "PASTORAL", "MEMBER", "USER", "GUEST"]
    const statuses = ["SUCCEEDED", "PENDING", "FAILED", "REFUNDED"]

    const createEmptyStats = (): TimeframeStats => ({
      dailyAmount: 0,
      monthlyAmount: 0,
      yearlyAmount: 0,
      totalAmount: 0,
      dailyCount: 0,
      monthlyCount: 0,
      yearlyCount: 0,
      totalCount: 0,
    })

    const roleStats: Record<string, Record<string, TimeframeStats>> = {}
    rolesList.forEach((role) => {
      const statsMap: Record<string, TimeframeStats> = {}
      statuses.forEach((status) => {
        statsMap[status] = createEmptyStats()
      })
      roleStats[role] = statsMap
    })

    const totalStats: Record<string, TimeframeStats> = {}
    statuses.forEach((status) => {
      totalStats[status] = createEmptyStats()
    })

    allDonations.forEach((d) => {
      const amount = Number(d.amount)
      const date = d.createdAt
      const status = d.status.toUpperCase()

      // Map user role
      let roleName = "GUEST"
      if (d.user && d.user.userRoles && d.user.userRoles.length > 0) {
        const roles = d.user.userRoles.map((ur: any) => ur.role.name.toUpperCase())
        if (roles.includes("SUPER_ADMIN")) {
          roleName = "SUPER_ADMIN"
        } else if (roles.includes("BOARD")) {
          roleName = "BOARD"
        } else if (roles.includes("PASTORAL")) {
          roleName = "PASTORAL"
        } else if (roles.includes("MEMBER")) {
          roleName = "MEMBER"
        } else if (roles.includes("USER")) {
          roleName = "USER"
        } else if (roles[0]) {
          roleName = roles[0]
        }
      }

      // Ensure stats bucket exists for the role
      if (!roleStats[roleName]) {
        roleStats[roleName] = {}
      }
      const roleMap = roleStats[roleName]!

      // Ensure stats bucket exists for the role's status
      if (!roleMap[status]) {
        roleMap[status] = createEmptyStats()
      }

      const roleStatusStats = roleMap[status]!
      const overallStatusStats = totalStats[status] || createEmptyStats()
      totalStats[status] = overallStatusStats

      // Update role status stats
      roleStatusStats.totalAmount += amount
      roleStatusStats.totalCount += 1
      if (date >= oneDayAgo) {
        roleStatusStats.dailyAmount += amount
        roleStatusStats.dailyCount += 1
      }
      if (date >= oneMonthAgo) {
        roleStatusStats.monthlyAmount += amount
        roleStatusStats.monthlyCount += 1
      }
      if (date >= oneYearAgo) {
        roleStatusStats.yearlyAmount += amount
        roleStatusStats.yearlyCount += 1
      }

      // Update overall status stats
      overallStatusStats.totalAmount += amount
      overallStatusStats.totalCount += 1
      if (date >= oneDayAgo) {
        overallStatusStats.dailyAmount += amount
        overallStatusStats.dailyCount += 1
      }
      if (date >= oneMonthAgo) {
        overallStatusStats.monthlyAmount += amount
        overallStatusStats.monthlyCount += 1
      }
      if (date >= oneYearAgo) {
        overallStatusStats.yearlyAmount += amount
        overallStatusStats.yearlyCount += 1
      }
    })

    return {
      roleStats,
      totalStats,
    }
  }

  static async filterDonations(params: {
    page: number
    limit: number
    skip: number
    status: string
    search: string
    minAmount: number
    maxAmount: number
    createdAt: string
    role?: string
  }) {
    const { page, limit, skip, status, search, minAmount, maxAmount, createdAt, role } = params

    const where: any = {}

    // Status Filter
    if (status && status !== "ALL") {
      where.status = status.toUpperCase()
    }

    // Role Filter
    if (role && role !== "ALL") {
      if (role.toUpperCase() === "GUEST") {
        where.userId = null
      } else {
        const dbRoleName = role.toUpperCase() === "GENERAL" ? "MEMBER" : role.toUpperCase()
        where.user = {
          userRoles: {
            some: {
              role: {
                name: dbRoleName,
              },
            },
          },
        }
      }
    }

    // Search Filter (Donator name, email, phone, or User name, email)
    if (search) {
      where.OR = [
        {
          donator: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        { id: { contains: search } },
      ]
    }

    // Amount Range Filter
    if (minAmount !== undefined && minAmount !== null) {
      where.amount = {
        ...where.amount,
        gte: minAmount,
      }
    }
    if (maxAmount !== undefined && maxAmount !== null) {
      where.amount = {
        ...where.amount,
        lte: maxAmount,
      }
    }

    // Date Range Filter
    if (createdAt) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(createdAt),
      }
    }
   

    const [totalCount, data] = await prisma.$transaction([
      prisma.donation.count({ where }),
      prisma.donation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          donator: true,
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
    ])

    return { data, totalCount }
  }

}
