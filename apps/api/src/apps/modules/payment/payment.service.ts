import { TRPCError } from "@trpc/server"
import { ZTDonationInput, ZTSponsorshipInput } from "@workspace/types/index.js"
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
          await prisma.payment.update({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: {
              status: "SUCCEEDED",
            },
          })
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