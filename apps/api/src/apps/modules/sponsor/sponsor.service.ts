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
}
