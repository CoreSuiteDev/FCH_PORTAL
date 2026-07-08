import { TRPCError } from "@trpc/server"
import { ZTDonationInput, ZTSponsorshipInput } from "@workspace/types/index.js"
import { Prisma } from "../../../generated/prisma/client.js"
import { prisma } from "../../../infrastructure/database/prisma.js"
import { stripe } from "../../../infrastructure/stripe/stripe.js"
import config from "../../../utils/config.js"




export class PaymentService {
  /**
   * Fetch payment transaction history (paginated)
   */
  static async getHistory(params: { page: number; limit: number }) {
    const { page, limit } = params
    const skip = (page - 1) * limit

    const [totalCount, payments] = await prisma.$transaction([
      prisma.payment.count(),
      prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ])

    const data = payments.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      status: p.status,
      date: p.createdAt,
    }))

    return { totalCount, data }
  }

  static async webhookHandler(
    signature: string,
    rawBody: Buffer
  ): Promise<void> {
    let event

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        config.stripe.webhookSecret
      )
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Webhook signature verification failed: ${err.message}`,
        cause: err,
      })
    }

    const paymentIntent = event.data.object as any

    // Retrieve the Charge to get receipt URL and card details
    let charge: Awaited<ReturnType<typeof stripe.charges.retrieve>> | null =
      null
    if (paymentIntent.latest_charge) {
      try {
        charge = await stripe.charges.retrieve(paymentIntent.latest_charge)
      } catch (err: any) {
        // Non-fatal — proceed without charge details
        console.warn(
          `[webhook] Could not retrieve charge ${paymentIntent.latest_charge}: ${err.message}`
        )
      }
    }

    const receiptUrl = charge?.receipt_url ?? null
    const paymentMethod = charge?.payment_method_details?.type ?? null
    const cardBrand = charge?.payment_method_details?.card?.brand ?? null
    const cardLast4 = charge?.payment_method_details?.card?.last4 ?? null
    const errorMessage = paymentIntent.last_payment_error?.message ?? null
    const customerId = (paymentIntent.customer as string | null) ?? null

    // Determine type: donation, sponsorship, or payment
    let type: "donation" | "sponsorship" | "payment" | null = paymentIntent.metadata?.type || null

    if (!type) {
      // Lookup in database to see where the payment intent belongs
      const donationExists = await prisma.donation.findUnique({
        where: { paymentIntentId: paymentIntent.id },
        select: { id: true },
      })

      if (donationExists) {
        type = "donation"
      } else {
        const sponsorshipExists = await prisma.sponsorship.findUnique({
          where: { paymentIntentId: paymentIntent.id },
          select: { id: true },
        })

        if (sponsorshipExists) {
          type = "sponsorship"
        } else {
          const paymentExists = await prisma.payment.findUnique({
            where: { stripePaymentIntentId: paymentIntent.id },
            select: { id: true },
          })

          if (paymentExists) {
            type = "payment"
          }
        }
      }
    }

    if (!type) {
      console.warn(`[webhook] No matching entity found for PaymentIntent: ${paymentIntent.id}`)
      return
    }

    try {
      if (type === "donation") {
        if (event.type === "payment_intent.succeeded") {
          let mappedPaymentMethod: "CARD" | "BANK_TRANSFER" | "CASH" | "OTHER" = "CARD";
          if (paymentMethod === "bank_transfer") {
            mappedPaymentMethod = "BANK_TRANSFER";
          } else if (paymentMethod === "cash") {
            mappedPaymentMethod = "CASH";
          } else if (paymentMethod && paymentMethod !== "card") {
            mappedPaymentMethod = "OTHER";
          }

          await prisma.donation.update({
            where: { paymentIntentId: paymentIntent.id },
            data: {
              status: "SUCCEEDED",
              receiptUrl,
              paymentMethod: mappedPaymentMethod,
              cardBrand,
              cardLast4,
            },
          })

          const donationObj = await prisma.donation.findUnique({
            where: { paymentIntentId: paymentIntent.id },
            select: { donatorId: true },
          })
          if (donationObj?.donatorId && customerId) {
            await prisma.donator.update({
              where: { id: donationObj.donatorId },
              data: { stripeCustomerId: customerId },
            })
          }
          console.log(
            `[webhook] Donation SUCCEEDED — PaymentIntent: ${paymentIntent.id}`
          )
        } else if (event.type === "payment_intent.payment_failed") {
          await prisma.donation.update({
            where: { paymentIntentId: paymentIntent.id },
            data: {
              status: "FAILED",
              failureReason: errorMessage,
            },
          })
          console.log(
            `[webhook] Donation FAILED — PaymentIntent: ${paymentIntent.id}`
          )
        }
      } else if (type === "sponsorship") {
        if (event.type === "payment_intent.succeeded") {
          let mappedPaymentMethod: "CARD" | "BANK_TRANSFER" | "CASH" | "OTHER" = "CARD";
          if (paymentMethod === "bank_transfer") {
            mappedPaymentMethod = "BANK_TRANSFER";
          } else if (paymentMethod === "cash") {
            mappedPaymentMethod = "CASH";
          } else if (paymentMethod && paymentMethod !== "card") {
            mappedPaymentMethod = "OTHER";
          }

          await prisma.sponsorship.update({
            where: { paymentIntentId: paymentIntent.id },
            data: {
              status: "SUCCEEDED",
              receiptUrl,
              paymentMethod: mappedPaymentMethod,
              cardBrand,
              cardLast4,
              stripeCustomerId: customerId,
            },
          })
          console.log(
            `[webhook] Sponsorship SUCCEEDED — PaymentIntent: ${paymentIntent.id}`
          )
        } else if (event.type === "payment_intent.payment_failed") {
          await prisma.sponsorship.update({
            where: { paymentIntentId: paymentIntent.id },
            data: {
              status: "FAILED",
              errorMessage,
              stripeCustomerId: customerId,
            },
          })
          console.log(
            `[webhook] Sponsorship FAILED — PaymentIntent: ${paymentIntent.id}`
          )
        }
      } else if (type === "payment") {
        if (event.type === "payment_intent.succeeded") {
          const payment = await prisma.payment.update({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: {
              status: "SUCCEEDED",
            },
            include: {
              subscription: {
                include: {
                  package: true,
                },
              },
            },
          })

          if (payment.subscription) {
            await prisma.subscription.update({
              where: { id: payment.subscription.id },
              data: {
                status: "ACTIVE",
              },
            })

            const roleName = payment.subscription.package.type === "GENERAL" ? "MEMBER" : "PASTORAL"
            const { UserService } = await import("../user/user.service.js")
            await UserService.updateUserRole(payment.subscription.userId, roleName)
          }

          console.log(
            `[webhook] Payment SUCCEEDED — PaymentIntent: ${paymentIntent.id}`
          )
        } else if (event.type === "payment_intent.payment_failed") {
          await prisma.payment.update({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: {
              status: "FAILED",
            },
          })
          console.log(
            `[webhook] Payment FAILED — PaymentIntent: ${paymentIntent.id}`
          )
        }
      }
    } catch (dbErr: any) {
      console.error(`[webhook] Database update failed for type ${type}:`, dbErr)
    }
  }
}

// DonationService

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
      paymentMethodId,
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

    // Upsert donator — handles repeat donors with the same email gracefully
    const donator = await prisma.donator.upsert({
      where: { email: donorEmail },
      update: { name: donorName, phone: donorPhone ?? undefined },
      create: { name: donorName, email: donorEmail, phone: donorPhone ?? undefined },
    })

    const amountInCents = Math.round(amount * 100)

    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        description,
        payment_method: paymentMethodId,
        confirm: true,
        return_url: `${config.frontendUrl}`,
        metadata: {
          donatorId: donator.id,
          userId: userId ?? "guest",
          type: "donation",
        },
      })
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Stripe error",
        cause: err,
      })
    }

    // Retrieve receipt details from latest charge if succeeded immediately
    let receiptUrl: string | null = null
    let paymentMethod: string | null = null
    let cardBrand: string | null = null
    let cardLast4: string | null = null

    if (paymentIntent.status === "succeeded" && paymentIntent.latest_charge) {
      try {
        const charge = await stripe.charges.retrieve(
          paymentIntent.latest_charge as string
        )
        receiptUrl = charge.receipt_url ?? null
        paymentMethod = charge.payment_method_details?.type ?? null
        cardBrand = charge.payment_method_details?.card?.brand ?? null
        cardLast4 = charge.payment_method_details?.card?.last4 ?? null
      } catch (chargeErr) {
        console.warn(
          `[createStripeDonation] Could not retrieve charge details:`,
          chargeErr
        )
      }
    }

    let mappedPaymentMethod: "CARD" | "BANK_TRANSFER" | "CASH" | "OTHER" = "CARD";
    if (paymentMethod === "bank_transfer") {
      mappedPaymentMethod = "BANK_TRANSFER";
    } else if (paymentMethod === "cash") {
      mappedPaymentMethod = "CASH";
    } else if (paymentMethod && paymentMethod !== "card") {
      mappedPaymentMethod = "OTHER";
    }

    const donation = await prisma.donation.create({
      data: {
        amount,
        currency: currency.toUpperCase() as "USD" | "EUR",
        status: paymentIntent.status === "succeeded" ? "SUCCEEDED" : "PENDING",
        paymentIntentId: paymentIntent.id,
        donatorId: donator.id,
        userId: userId ?? null,
        receiptUrl,
        paymentMethod: mappedPaymentMethod,
        cardBrand,
        cardLast4,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret!,
      donationId: donation.id,
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
}

// Sponsorship
export class SponsorShipService {
 static async createStripeSponsorship(body: ZTSponsorshipInput) {
    const { amount, currency, email, phone, name, paymentMethodId, tier, userId, description } = body

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

    const sponsor = await prisma.sponsor.upsert({
      where: { email: sponsorEmail },
      update: { name: sponsorName, phone: sponsorPhone ?? undefined },
      create: { name: sponsorName, email: sponsorEmail, phone: sponsorPhone ?? undefined },
    })

    const amountInCents = Math.round(amount * 100)

    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        description,
        payment_method: paymentMethodId,
        confirm: true,
        return_url: `${config.frontendUrl}`,
        metadata: {
          sponsorId: sponsor.id,
          userId: userId ?? "guest",
          type: "sponsorship",
        },
      })
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Stripe error",
        cause: err,
      })
    }

    // Retrieve receipt details from latest charge if succeeded immediately
    let receiptUrl: string | null = null
    let paymentMethod: string | null = null
    let cardBrand: string | null = null
    let cardLast4: string | null = null

    if (paymentIntent.status === "succeeded" && paymentIntent.latest_charge) {
      try {
        const charge = await stripe.charges.retrieve(
          paymentIntent.latest_charge as string
        )
        receiptUrl = charge.receipt_url ?? null
        paymentMethod = charge.payment_method_details?.type ?? null
        cardBrand = charge.payment_method_details?.card?.brand ?? null
        cardLast4 = charge.payment_method_details?.card?.last4 ?? null
      } catch (chargeErr) {
        console.warn(
          `[createStripeSponsorship] Could not retrieve charge details:`,
          chargeErr
        )
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

    let mappedPaymentMethod: "CARD" | "BANK_TRANSFER" | "CASH" | "OTHER" = "CARD";
    if (paymentMethod === "bank_transfer") {
      mappedPaymentMethod = "BANK_TRANSFER";
    } else if (paymentMethod === "cash") {
      mappedPaymentMethod = "CASH";
    } else if (paymentMethod && paymentMethod !== "card") {
      mappedPaymentMethod = "OTHER";
    }

    const sponsorship = await prisma.sponsorship.create({
      data: {
        planId: plan.id,
        amount,
        currency: currency.toUpperCase() as "USD" | "EUR",
        status: paymentIntent.status === "succeeded" ? "SUCCEEDED" : "PENDING",
        paymentIntentId: paymentIntent.id,
        sponsorId: sponsor.id, 
        userId: userId ?? null,
        receiptUrl,
        paymentMethod: mappedPaymentMethod,
        cardBrand,
        cardLast4,
      },
    })

   
    return {
      clientSecret: paymentIntent.client_secret!,
      sponsorshipId: sponsorship.id, 
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
                role: true
              }
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
        id
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
  
}


// Membership
export class MembershipService {
  static async createMembershipSubscription(body: {
    packageId: string
    name: string
    email: string
    phone?: string
    userId: string
    paymentMethodId: string
  }) {
    const { packageId, name, email, phone, userId, paymentMethodId } = body

    const pkg = await prisma.membershipPackage.findUnique({
      where: { id: packageId },
    })
    if (!pkg) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Membership package not found",
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    const basePrice = Number(pkg.price)
    const amountInCents = Math.round(basePrice * 100)

    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: pkg.currency.toLowerCase(),
        description: `Membership Subscription: ${pkg.name}`,
        payment_method: paymentMethodId,
        confirm: true,
        return_url: `${config.frontendUrl}`,
        metadata: {
          packageId: pkg.id,
          userId,
          type: "payment",
        },
      })
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Stripe error",
        cause: err,
      })
    }

    let receiptUrl: string | null = null
    let paymentMethod: string | null = null
    let cardBrand: string | null = null
    let cardLast4: string | null = null

    if (paymentIntent.status === "succeeded" && paymentIntent.latest_charge) {
      try {
        const charge = await stripe.charges.retrieve(
          paymentIntent.latest_charge as string
        )
        receiptUrl = charge.receipt_url ?? null
        paymentMethod = charge.payment_method_details?.type ?? null
        cardBrand = charge.payment_method_details?.card?.brand ?? null
        cardLast4 = charge.payment_method_details?.card?.last4 ?? null
      } catch (chargeErr) {
        console.warn(
          `[createMembershipSubscription] Could not retrieve charge details:`,
          chargeErr
        )
      }
    }

    const currentPeriodStart = new Date()
    const currentPeriodEnd = new Date()
    if (pkg.billingCycle === "MONTHLY") {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
    } else {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)
    }

    const isSucceeded = paymentIntent.status === "succeeded"

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        packageId: pkg.id,
        currentPeriodStart,
        currentPeriodEnd,
        status: isSucceeded ? "ACTIVE" : "PENDING",
      },
    })

    await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: basePrice,
        currency: pkg.currency,
        status: isSucceeded ? "SUCCEEDED" : "PENDING",
        stripePaymentIntentId: paymentIntent.id,
        receiptUrl,
        paymentMethod: paymentMethod === "card" ? "CARD" : "OTHER",
        cardBrand,
        cardLast4,
      },
    })

    if (isSucceeded) {
      const roleName = pkg.type === "GENERAL" ? "MEMBER" : "PASTORAL"
      const { UserService } = await import("../user/user.service.js")
      await UserService.updateUserRole(userId, roleName)
    }

    return {
      clientSecret: paymentIntent.client_secret || "",
      subscriptionId: subscription.id,
    }
  }

  static async getMembershipsHistory(params: {
    page: number
    limit: number
    search?: string
    tier?: string
    status?: string
  }) {
    const { page, limit, search, tier, status } = params
    const skip = (page - 1) * limit

    const where: Prisma.SubscriptionWhereInput = {}

    if (tier && tier !== "ALL") {
      const dbType = tier.toUpperCase() === "GENERAL" ? "GENERAL" : "PASTORAL"
      where.package = {
        type: dbType,
      }
    }

    if (status && status !== "ALL") {

      const statusMap: Record<string, "ACTIVE" | "PENDING" | "CANCELED" | "EXPIRED" | "UNPAID"> = {
        "Active": "ACTIVE",
        "Pending": "PENDING",
        "Canceled": "CANCELED",
        "Expired": "EXPIRED",
        "Suspended": "UNPAID",
      }

      if(statusMap[status]) {
        where.status = statusMap[status]
      }
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ]
    }

    const [data, totalCount, statusCounts, generalEarnings, pastoralEarnings] = await Promise.all([
      prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: {createdAt: "desc"},
        include: {
          user: true,
          package: true,
          payments: {
            orderBy: {createdAt: "desc"},
            take: 1,
          }
        }
      }),

      prisma.subscription.count({where}),

      prisma.subscription.groupBy({
        by: "status",
        _count: {_all: true},
      }),

      prisma.payment.aggregate({
        where: {subscription: {package: {type: "GENERAL"}}},
        _sum: {amount: true}
      }),

      prisma.payment.aggregate({
        where: {subscription: {package: {type: "PASTORAL"}}},
        _sum: {amount: true}
      }),   
    ])

    const stats = {total: 0, active: 0, pending: 0, expiredOrCanceled: 0}
    statusCounts.forEach((group) => {
      const count = group._count._all
      stats.total += count
      if(group.status === "ACTIVE") stats.active += count
      if(group.status === "PENDING") stats.pending += count
      if(group.status === "EXPIRED" || group.status === "CANCELED") stats.expiredOrCanceled += count
    })

    // Calculate actual active Monthly & Yearly counts
    const activeSubs = await prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      include: { package: true }
    })

    const pricingStats = {
      general: { earnings: Number(generalEarnings._sum.amount || 0), monthlyCount: 0, yearlyCount: 0 },
      pastoral: { earnings: Number(pastoralEarnings._sum.amount || 0), monthlyCount: 0, yearlyCount: 0 },
    }

    activeSubs.forEach((sub) => {
      if (sub.package.type === "GENERAL") {
        if (sub.package.billingCycle === "MONTHLY") pricingStats.general.monthlyCount++
        else if (sub.package.billingCycle === "YEARLY") pricingStats.general.yearlyCount++
      } else if (sub.package.type === "PASTORAL") {
        if (sub.package.billingCycle === "MONTHLY") pricingStats.pastoral.monthlyCount++
        else if (sub.package.billingCycle === "YEARLY") pricingStats.pastoral.yearlyCount++
      }
    })

    // Define time ranges
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    // Calculate Active Income/Sales: Daily, Monthly, Yearly, Total counts & amounts
    const allSuccessfulPayments = await prisma.payment.findMany({
      where: { status: { in: ["SUCCEEDED", "PARTIALLY_REFUNDED"] } },
      include: { subscription: { include: { package: true } } }
    })

    const salesStats = {
      general: {
        daily: { count: 0, amount: 0 },
        monthly: { count: 0, amount: 0 },
        yearly: { count: 0, amount: 0 },
        total: { count: 0, amount: 0 },
      },
      pastoral: {
        daily: { count: 0, amount: 0 },
        yearly: { count: 0, amount: 0 },
        monthly: { count: 0, amount: 0 },
        total: { count: 0, amount: 0 },
      }
    }

    allSuccessfulPayments.forEach((pay) => {
      const amt = Number(pay.amount)
      const date = pay.createdAt
      const type = pay.subscription?.package?.type // "GENERAL" | "PASTORAL"
      if (!type) return

      const target = type === "GENERAL" ? salesStats.general : salesStats.pastoral

      target.total.count++
      target.total.amount += amt

      if (date >= oneDayAgo) {
        target.daily.count++
        target.daily.amount += amt
      }
      if (date >= oneMonthAgo) {
        target.monthly.count++
        target.monthly.amount += amt
      }
      if (date >= oneYearAgo) {
        target.yearly.count++
        target.yearly.amount += amt
      }
    })

    // Calculate Cancellations & Refund Stats: Daily, Monthly, Yearly, Total
    const allApprovedCancellations = await prisma.cancellationRequest.findMany({
      where: { status: "APPROVED" }
    })

    const cancelStats = {
      daily: { count: 0, refundSum: 0 },
      monthly: { count: 0, refundSum: 0 },
      yearly: { count: 0, refundSum: 0 },
      total: { count: 0, refundSum: 0 },
    }

    allApprovedCancellations.forEach((req) => {
      const date = req.processedAt || req.updatedAt
      const refund = req.refundAmount ? Number(req.refundAmount) : 0

      cancelStats.total.count++
      cancelStats.total.refundSum += refund

      if (date >= oneDayAgo) {
        cancelStats.daily.count++
        cancelStats.daily.refundSum += refund
      }
      if (date >= oneMonthAgo) {
        cancelStats.monthly.count++
        cancelStats.monthly.refundSum += refund
      }
      if (date >= oneYearAgo) {
        cancelStats.yearly.count++
        cancelStats.yearly.refundSum += refund
      }
    })

    return {
      data: data.map((sub) => {
        const latestPayment = sub.payments[0]
        const amount = latestPayment ? Number(latestPayment.amount) : Number(sub.package.price)
        const currencySymbol = sub.package.currency === "USD" ? "$" : sub.package.currency + " "

        const statusFmtMap: Record<string, any> = {
          ACTIVE: "Active",
          CANCELED: "Canceled",
          CANCELLED: "Canceled",
          EXPIRED: "Expired",
          PENDING: "Pending",
          UNPAID: "Suspended",
          PAST_DUE: "Suspended",
        }

        const fmt = (d: Date) =>
          d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

        return {
          id: sub.id,
          name: sub.user?.name || "Unknown User",
          email: sub.user?.email || "No Email",
          tier: sub.package.type === "PASTORAL" ? "Pastoral" : "General",
          packageName: sub.package.name,
          billingCycle: sub.package.billingCycle as "MONTHLY" | "YEARLY",
          joinedDate: fmt(sub.createdAt),
          expiryDate: fmt(sub.currentPeriodEnd),
          amountPaid: `${currencySymbol} ${amount.toFixed(2)}`,
          status: statusFmtMap[sub.status] || "Pending",
          paymentStatus: latestPayment?.status ?? null,
          stripePaymentIntentId: latestPayment?.stripePaymentIntentId ?? null,
          cardBrand: latestPayment?.cardBrand ?? null,
          cardLast4: latestPayment?.cardLast4 ?? null,
          paymentMethod: latestPayment?.paymentMethod ?? null,
          receiptUrl: latestPayment?.receiptUrl ?? null,
        }
      }),
      totalCount,
      stats,
      pricingStats,
      salesStats,
      cancelStats,
    }
  }

  static async getUserMemberships(userId: string) {
    const subs = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        package: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    return subs.map((sub) => {
      const latestPayment = sub.payments[0]
      const amount = latestPayment ? Number(latestPayment.amount) : Number(sub.package.price)
      const currencySymbol = sub.package.currency === "USD" ? "$" : sub.package.currency + " "

      let status: "Active" | "Pending" | "Expired" | "Canceled" | "Suspended" = "Pending"
      if (sub.status === "ACTIVE") status = "Active"
      else if (sub.status === "CANCELED") status = "Canceled"
      else if (sub.status === "EXPIRED") status = "Expired"
      else if (sub.status === "UNPAID" || sub.status === "PAST_DUE") status = "Suspended"

      let tier: "General" | "Pastoral" | "Board" = "General"
      if (sub.package.type === "PASTORAL") tier = "Pastoral"

      const fmt = (d: Date) =>
        d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

      return {
        id: sub.id,
        tier,
        packageName: sub.package.name,
        billingCycle: sub.package.billingCycle as "MONTHLY" | "YEARLY",
        joinedDate: fmt(sub.createdAt),
        expiryDate: fmt(sub.currentPeriodEnd),
        amountPaid: `${currencySymbol}${amount.toFixed(2)}`,
        status,
        paymentStatus: latestPayment?.status ?? null,
        stripePaymentIntentId: latestPayment?.stripePaymentIntentId ?? null,
      }
    })
  }

  static async deleteMembershipSubscription(id: string) {
    const sub = await prisma.subscription.findUnique({
      where: { id },
    })
    if (!sub) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Membership subscription not found",
      })
    }
    await prisma.subscription.delete({
      where: { id },
    })
    return { id }
  }

  static async updateMembershipStatus(id: string, status: "Active" | "Pending" | "Expired" | "Canceled" | "Suspended") {
    let dbStatus: "ACTIVE" | "PENDING" | "CANCELED" | "EXPIRED" | "UNPAID" = "PENDING"
    if (status === "Active") dbStatus = "ACTIVE"
    else if (status === "Pending") dbStatus = "PENDING"
    else if (status === "Canceled") dbStatus = "CANCELED"
    else if (status === "Expired") dbStatus = "EXPIRED"
    else if (status === "Suspended") dbStatus = "UNPAID"

    const sub = await prisma.subscription.findUnique({
      where: { id },
    })
    if (!sub) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Membership subscription not found",
      })
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        status: dbStatus,
      },
    })
    return updated
  }

  // ── Cancellation request flow ────────────────────────────────────────────

  /**
   * User submits a cancellation request for their active subscription.
   * Blocks duplicate PENDING requests.
   */
  static async requestCancellation(body: {
    userId: string
    subscriptionId: string
    reason: string
  }) {
    const { userId, subscriptionId, reason } = body

    // Verify the subscription belongs to this user and is active
    const sub = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { package: true, payments: { orderBy: { createdAt: "desc" }, take: 1 } },
    })
    if (!sub) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Subscription not found" })
    }
    if (sub.userId !== userId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "This subscription does not belong to you" })
    }
    if (sub.status !== "ACTIVE") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Only ACTIVE subscriptions can be cancelled (current: ${sub.status})`,
      })
    }

    // Block duplicate pending request
    const existing = await prisma.cancellationRequest.findFirst({
      where: { subscriptionId, status: "PENDING" },
    })
    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "You already have a pending cancellation request for this subscription",
      })
    }

    // Calculate pro-rata refund for display purposes
    const now = new Date()
    const periodTotal = sub.currentPeriodEnd.getTime() - sub.currentPeriodStart.getTime()
    const remaining = sub.currentPeriodEnd.getTime() - now.getTime()
    const ratio = Math.max(0, Math.min(1, remaining / periodTotal))
    const latestPayment = sub.payments[0]
    const amountPaid = latestPayment ? Number(latestPayment.amount) : Number(sub.package.price)
    const estimatedRefund = parseFloat((amountPaid * ratio).toFixed(2))

    const request = await prisma.cancellationRequest.create({
      data: {
        userId,
        subscriptionId,
        reason,
      },
    })

    return { id: request.id, estimatedRefund }
  }

  /**
   * Admin: Get all cancellation requests (paginated, filterable by status)
   */
  static async getCancellationRequests(params: {
    page: number
    limit: number
    search?: string
    tier?: string
    status?: string
  }) {
    const { page, limit, search, tier, status } = params
    const skip = (page - 1) * limit

    const where: any = {}

    if (status && status !== "ALL") {
      where.status = status as "PENDING" | "APPROVED" | "REJECTED"
    }

    if (tier && tier !== "ALL") {
      const dbType = tier.toUpperCase() === "GENERAL" ? "GENERAL" : "PASTORAL"
      where.subscription = {
        package: {
          type: dbType,
        }
      }
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { reason: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ]
    }

    const [totalCount, data] = await prisma.$transaction([
      prisma.cancellationRequest.count({ where }),
      prisma.cancellationRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          subscription: {
            include: {
              package: true,
              payments: { orderBy: { createdAt: "desc" }, take: 1 },
            },
          },
        },
      }),
    ])

    const formatted = data.map((req) => {
      const sub = req.subscription
      const now = new Date()
      const periodTotal = sub.currentPeriodEnd.getTime() - sub.currentPeriodStart.getTime()
      const remaining = sub.currentPeriodEnd.getTime() - now.getTime()
      const ratio = Math.max(0, Math.min(1, remaining / periodTotal))
      const latestPayment = sub.payments[0]
      const amountPaid = latestPayment ? Number(latestPayment.amount) : Number(sub.package.price)
      const estimatedRefund = parseFloat((amountPaid * ratio).toFixed(2))

      return {
        id: req.id,
        createdAt: req.createdAt,
        reason: req.reason,
        status: req.status,
        adminNote: req.adminNote ?? null,
        refundAmount: req.refundAmount ? Number(req.refundAmount) : null,
        processedAt: req.processedAt ?? null,
        user: req.user,
        subscription: {
          id: sub.id,
          status: sub.status,
          packageName: sub.package.name,
          tier: sub.package.type,
          billingCycle: sub.package.billingCycle,
          amountPaid,
          currency: sub.package.currency,
          currentPeriodEnd: sub.currentPeriodEnd,
          stripePaymentIntentId: latestPayment?.stripePaymentIntentId ?? null,
        },
        estimatedRefund,
      }
    })

    return { data: formatted, totalCount }
  }

  /**
   * Super-admin: approve (with refund) or reject a cancellation request.
   */
  static async processCancellation(body: {
    requestId: string
    action: "APPROVE" | "REJECT"
    refundAmount?: number
    adminNote?: string
  }) {
    const { requestId, action, refundAmount, adminNote } = body

    const req = await prisma.cancellationRequest.findUnique({
      where: { id: requestId },
      include: {
        subscription: {
          include: {
            package: true,
            payments: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        },
        user: { select: { id: true } },
      },
    })

    if (!req) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Cancellation request not found" })
    }
    if (req.status !== "PENDING") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Request is already ${req.status}`,
      })
    }

    if (action === "REJECT") {
      await prisma.cancellationRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          adminNote: adminNote ?? null,
          processedAt: new Date(),
        },
      })
      return { success: true, action: "REJECTED" }
    }

    // ── APPROVE path ────────────────────────────────────────────────────────

    const sub = req.subscription
    const latestPayment = sub.payments[0]

    // Calculate pro-rata refund if not explicitly provided
    let finalRefundAmount = refundAmount
    if (finalRefundAmount === undefined || finalRefundAmount === null) {
      const now = new Date()
      const periodTotal = sub.currentPeriodEnd.getTime() - sub.currentPeriodStart.getTime()
      const remaining = sub.currentPeriodEnd.getTime() - now.getTime()
      const ratio = Math.max(0, Math.min(1, remaining / periodTotal))
      const amountPaid = latestPayment ? Number(latestPayment.amount) : Number(sub.package.price)
      finalRefundAmount = parseFloat((amountPaid * ratio).toFixed(2))
    }

    // Issue partial refund on Stripe if there's a payment intent and a refund > 0
    let stripeRefundId: string | null = null
    if (finalRefundAmount > 0 && latestPayment?.stripePaymentIntentId) {
      try {
        const refundAmountCents = Math.round(finalRefundAmount * 100)
        const refund = await stripe.refunds.create({
          payment_intent: latestPayment.stripePaymentIntentId,
          amount: refundAmountCents,
          reason: "requested_by_customer",
        })
        stripeRefundId = refund.id

        // Mark payment as PARTIALLY_REFUNDED
        await prisma.payment.update({
          where: { id: latestPayment.id },
          data: {
            status: "PARTIALLY_REFUNDED",
            refundedAmount: finalRefundAmount,
          },
        })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown Stripe error"
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Stripe refund failed: ${msg}`,
        })
      }
    }

    // Cancel the subscription
    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: "CANCELED",
        cancelledAt: new Date(),
        cancelAtPeriodEnd: false,
      },
    })

    // Revert user role back to GENERAL
    const { UserService } = await import("../user/user.service.js")
    await UserService.updateUserRole(req.user.id, "GENERAL")

    // Mark the request as APPROVED
    await prisma.cancellationRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        refundAmount: finalRefundAmount,
        adminNote: adminNote ?? null,
        processedAt: new Date(),
      },
    })

    return {
      success: true,
      action: "APPROVED",
      refundAmount: finalRefundAmount,
      stripeRefundId,
    }
  }

  /**
   * User: get their own cancellation requests
   */
  static async getUserCancellationRequests(userId: string) {
    const data = await prisma.cancellationRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        subscription: {
          include: { package: true },
        },
      },
    })

    return data.map((req) => ({
      id: req.id,
      createdAt: req.createdAt,
      reason: req.reason,
      status: req.status,
      adminNote: req.adminNote ?? null,
      refundAmount: req.refundAmount ? Number(req.refundAmount) : null,
      processedAt: req.processedAt ?? null,
      packageName: req.subscription.package.name,
      subscriptionId: req.subscriptionId,
    }))
  }
}
