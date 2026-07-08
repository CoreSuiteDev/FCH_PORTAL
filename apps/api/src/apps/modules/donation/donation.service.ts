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
}
