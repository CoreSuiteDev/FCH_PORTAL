import { TRPCError } from "@trpc/server"
import Stripe from "stripe"
import { prisma, Prisma } from "../../../infrastructure/database/prisma.js"
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
    console.log(
      `[Webhook Service] Starting webhookHandler. Signature: ${signature ? signature.substring(0, 20) : "none"}...`
    )
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        config.stripe.webhookSecret
      )
    } catch (err: any) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[Webhook Warning] Stripe signature verification failed: ${err.message}. Bypassing verification for local development.`
        )
        try {
          event = JSON.parse(rawBody.toString())
        } catch (parseErr: any) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Failed to parse raw body: ${parseErr.message}`,
            cause: parseErr,
          })
        }
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Webhook signature verification failed: ${err.message}`,
          cause: err,
        })
      }
    }

    console.log(
      `[Webhook Service] Stripe event parsed successfully. Event Type: ${event.type}`
    )

    if (event.type === "checkout.session.completed") {
      const initialSession = event.data.object as Stripe.Checkout.Session
      const metadata = initialSession.metadata

      console.log(
        `[Webhook Service] Received checkout.session.completed for Session: ${initialSession.id}. Metadata:`,
        metadata
      )

      if (!metadata) {
        console.warn(
          `[Webhook Service Warning] No metadata found in checkout session ${initialSession.id}. Skipping.`
        )
        return
      }

      const type = metadata.type

      const stripeCustomerId = initialSession.customer as string

      let paymentIntentId: string | null = null
      let stripeChargeId: string | null = null
      let receiptUrl: string | null = null
      let cardBrand: string | null = null
      let cardLast4: string | null = null
      let invoiceUrl: string | null = null

      try {
        const isMock =
          (initialSession.payment_intent &&
            (initialSession.payment_intent as string).startsWith("pi_mock")) ||
          (initialSession.subscription &&
            (initialSession.subscription as string).startsWith("sub_mock"))

        if (process.env.NODE_ENV !== "production" && isMock) {
          throw new Error("Mock event detected, bypassing real API retrieve.")
        }

        console.log(
          `[Webhook Service] Fetching full session data with expansions for ID: ${initialSession.id}`
        )

        const expandedSession = await stripe.checkout.sessions.retrieve(
          initialSession.id,
          {
            expand: [
              "payment_intent",
              "payment_intent.latest_charge",
              "subscription",
              "subscription.latest_invoice",
              "subscription.latest_invoice.payments",
              "invoice",
              "invoice.payments",
            ],
          }
        )

        let chargeObj: Stripe.Charge | null = null
        let invoiceObj: Stripe.Invoice | null = null

        // Subscription flow: invoice is attached to the subscription
        if (expandedSession.subscription) {
          const subscription =
            expandedSession.subscription as Stripe.Subscription | null
          invoiceObj = subscription?.latest_invoice as Stripe.Invoice | null

          if (invoiceObj) {
            invoiceUrl =
              invoiceObj.hosted_invoice_url || invoiceObj.invoice_pdf || null

            const firstPayment = invoiceObj.payments?.data?.[0]
            if (firstPayment?.payment.payment_intent) {
              paymentIntentId =
                typeof firstPayment.payment.payment_intent === "string"
                  ? firstPayment.payment.payment_intent
                  : firstPayment.payment.payment_intent.id
            }
            if (firstPayment?.payment.charge) {
              const charge = firstPayment.payment.charge
              if (typeof charge === "string") {
                stripeChargeId = charge
              } else {
                chargeObj = charge as Stripe.Charge
                stripeChargeId = charge.id
              }
            }
          }

          // Fallback to checkout session's payment intent
          if (!paymentIntentId && expandedSession.payment_intent) {
            const paymentIntent = expandedSession.payment_intent as
              | Stripe.PaymentIntent
              | string
            paymentIntentId =
              typeof paymentIntent === "string"
                ? paymentIntent
                : paymentIntent.id
            if (typeof paymentIntent !== "string") {
              chargeObj = paymentIntent.latest_charge as Stripe.Charge | null
              if (chargeObj) {
                stripeChargeId = chargeObj.id
              } else if (typeof paymentIntent.latest_charge === "string") {
                stripeChargeId = paymentIntent.latest_charge
              }
            }
          }
        } else {
          // One-time payment flow (donation, sponsorship): invoice attached directly to session
          const paymentIntent =
            expandedSession.payment_intent as Stripe.PaymentIntent | null
          paymentIntentId = paymentIntent ? paymentIntent.id : null

          if (paymentIntent) {
            if (paymentIntent.latest_charge) {
              if (typeof paymentIntent.latest_charge === "string") {
                stripeChargeId = paymentIntent.latest_charge
              } else {
                chargeObj = paymentIntent.latest_charge as Stripe.Charge
                stripeChargeId = chargeObj.id
              }
            }
          }

          invoiceObj = expandedSession.invoice as Stripe.Invoice | null
          if (invoiceObj) {
            invoiceUrl =
              invoiceObj.hosted_invoice_url || invoiceObj.invoice_pdf || null

            // Fallback: get payment intent / charge from invoice payments
            if (!paymentIntentId || !stripeChargeId) {
              const firstPayment = invoiceObj.payments?.data?.[0]
              if (!paymentIntentId && firstPayment?.payment.payment_intent) {
                paymentIntentId =
                  typeof firstPayment.payment.payment_intent === "string"
                    ? firstPayment.payment.payment_intent
                    : firstPayment.payment.payment_intent.id
              }
              if (!stripeChargeId && firstPayment?.payment.charge) {
                const charge = firstPayment.payment.charge
                if (typeof charge === "string") {
                  stripeChargeId = charge
                } else {
                  chargeObj = charge as Stripe.Charge
                  stripeChargeId = charge.id
                }
              }
            }
          }
        }

        // If we have a charge ID but not the full charge object, retrieve it to get card details
        if (stripeChargeId && !chargeObj) {
          console.log(`[Webhook Service] Retrieving full charge details for ID: ${stripeChargeId}`)
          chargeObj = await stripe.charges.retrieve(stripeChargeId)
        }

        if (chargeObj) {
          stripeChargeId = chargeObj.id
          receiptUrl = chargeObj.receipt_url
          cardBrand = chargeObj.payment_method_details?.card?.brand || null
          cardLast4 = chargeObj.payment_method_details?.card?.last4 || null
        }
      } catch (error: any) {
        console.warn(
          `[Webhook] Real Stripe data retrieval failed or bypassed: ${error.message}`
        )

        if (process.env.NODE_ENV !== "production") {
          console.log(
            "[Webhook] Populating mock payment details for local development."
          )
          stripeChargeId =
            stripeChargeId ||
            `ch_mock_${Math.random().toString(36).substring(2, 10)}`
          receiptUrl = receiptUrl || "https://stripe.com/receipt/mock"
          cardBrand = cardBrand || "Visa"
          cardLast4 = cardLast4 || "4242"
          invoiceUrl = invoiceUrl || "https://stripe.com/invoice/mock"
          paymentIntentId =
            paymentIntentId ||
            (initialSession.payment_intent as string) ||
            `pi_mock_${Math.random().toString(36).substring(2, 10)}`
        }
      }

      try {
        if (type === "donation" && metadata.donationId && metadata.donatorId) {
          const donationId = metadata.donationId
          const donatorId = metadata.donatorId
          const amount = metadata.amount
            ? new Prisma.Decimal(metadata.amount)
            : new Prisma.Decimal(0)

          console.log(
            `[Webhook Service] Processing donation database transaction. Donation ID: ${donationId}`
          )

          await prisma.$transaction([
            prisma.donation.update({
              where: { id: donationId },
              data: {
                status: "SUCCEEDED",
                paymentIntentId,
                stripeChargeId,
                paymentTransactionId: stripeChargeId,
                receiptUrl,
                cardBrand,
                cardLast4,
                invoiceUrl,
              },
            }),
            prisma.donator.update({
              where: { id: donatorId },
              data: {
                stripeCustomerId,
                totalDonationAmount: { increment: amount },
                totalDonationCount: { increment: 1 },
              },
            }),
          ])
          console.log(
            `[Webhook] Donation successfully recorded for: ${donationId}`
          )
        } else if (type === "sponsorship" && metadata.sponsorshipId) {
          const sponsorshipId = metadata.sponsorshipId
          console.log(
            `[Webhook Service] Processing sponsorship database update. Sponsorship ID: ${sponsorshipId}`
          )

          await prisma.sponsorship.update({
            where: { id: sponsorshipId },
            data: {
              status: "SUCCEEDED",
              paymentIntentId,
              stripeChargeId,
              paymentTransactionId: stripeChargeId,
              receiptUrl,
              cardBrand,
              cardLast4,
              invoiceUrl,
              stripeCustomerId,
            },
          })
          console.log(
            `[Webhook] Sponsorship successfully recorded for: ${sponsorshipId}`
          )
        } else if (
          type === "payment" &&
          metadata.paymentId &&
          metadata.subscriptionId &&
          metadata.userId
        ) {
          const paymentId = metadata.paymentId
          const subscriptionId = metadata.subscriptionId
          const userId = metadata.userId
          console.log(
            `[Webhook Service] Processing subscription database update. Payment ID: ${paymentId}, Subscription ID: ${subscriptionId}`
          )

          const payment = (await prisma.payment.update({
            where: { id: paymentId },
            data: {
              status: "SUCCEEDED",
              stripePaymentIntentId: paymentIntentId,
              stripeCheckoutSessionId: initialSession.id,
              stripeInvoiceId:
                (typeof initialSession.invoice === "string"
                  ? initialSession.invoice
                  : initialSession.invoice?.id) || null,
              receiptUrl,
              invoicePdfUrl: invoiceUrl,
              cardBrand,
              cardLast4,
            },
            include: {
              subscription: {
                include: {
                  package: true,
                },
              },
            },
          })) as any

          await prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
              status: "ACTIVE",
              stripeCustomerId,
            },
          })

          if (payment.subscription) {
            const roleName =
              payment.subscription.package.type === "GENERAL"
                ? "MEMBER"
                : "PASTORAL"
            const { UserService } = await import("../user/user.service.js")
            await UserService.updateUserRole(userId, roleName)
          }
          console.log(
            `[Webhook] Subscription payment successfully recorded for Payment: ${paymentId}`
          )
        }
      } catch (dbErr) {
        console.error(
          `[Webhook DB Error] Failed to process database updates: `,
          dbErr
        )
        throw dbErr
      }
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId = charge.payment_intent as string
      const amountRefunded = charge.amount_refunded / 100

      console.log(
        `[Webhook Service] Received charge.refunded for Payment Intent: ${paymentIntentId}. Amount refunded: $${amountRefunded}`
      )

      if (paymentIntentId) {
        try {
          const donation = await prisma.donation.findUnique({
            where: { paymentIntentId },
          })
          if (donation) {
            await prisma.donation.update({
              where: { id: donation.id },
              data: {
                status:
                  amountRefunded >= Number(donation.amount)
                    ? "REFUNDED"
                    : "PARTIALLY_REFUNDED",
                refundedAmount: amountRefunded,
                refundedAt: new Date(),
              },
            })
            console.log(
              `[Webhook] Donation refund updated for ID: ${donation.id}`
            )
          }

          const sponsorship = await prisma.sponsorship.findUnique({
            where: { paymentIntentId },
          })
          if (sponsorship) {
            await prisma.sponsorship.update({
              where: { id: sponsorship.id },
              data: {
                status:
                  amountRefunded >= Number(sponsorship.amount)
                    ? "REFUNDED"
                    : "PARTIALLY_REFUNDED",
                refundedAmount: amountRefunded,
                refundedAt: new Date(),
              },
            })
            console.log(
              `[Webhook] Sponsorship refund updated for ID: ${sponsorship.id}`
            )
          }

          const payment = await prisma.payment.findFirst({
            where: { stripePaymentIntentId: paymentIntentId },
          })
          if (payment) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: {
                status:
                  amountRefunded >= Number(payment.amount)
                    ? "REFUNDED"
                    : "PARTIALLY_REFUNDED",
                refundedAmount: amountRefunded,
              },
            })
            console.log(
              `[Webhook] Membership payment refund updated for ID: ${payment.id}`
            )
          }
        } catch (dbErr) {
          console.error(
            `[Webhook DB Error] Failed to process charge.refunded: `,
            dbErr
          )
        }
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const metadata = paymentIntent.metadata
      if (!metadata) return

      const errorMessage =
        paymentIntent.last_payment_error?.message ?? "Unknown error"
      const type = metadata.type

      try {
        if (type === "donation" && metadata.donationId) {
          const donationId = metadata.donationId
          await prisma.donation.update({
            where: { id: donationId },
            data: {
              status: "FAILED",
              failureReason: errorMessage,
            },
          })
          console.log(
            `[Webhook] Donation marked as FAILED for ID: ${donationId}`
          )
        } else if (type === "sponsorship" && metadata.sponsorshipId) {
          const sponsorshipId = metadata.sponsorshipId
          await prisma.sponsorship.update({
            where: { id: sponsorshipId },
            data: {
              status: "FAILED",
              errorMessage,
            },
          })
          console.log(
            `[Webhook] Sponsorship marked as FAILED for ID: ${sponsorshipId}`
          )
        } else if (
          type === "payment" &&
          metadata.paymentId &&
          metadata.subscriptionId
        ) {
          const paymentId = metadata.paymentId
          const subscriptionId = metadata.subscriptionId

          await prisma.$transaction([
            prisma.payment.update({
              where: { id: paymentId },
              data: {
                status: "FAILED",
                failureMessage: errorMessage,
              },
            }),
            prisma.subscription.update({
              where: { id: subscriptionId },
              data: {
                status: "CANCELED",
              },
            }),
          ])
          console.log(
            `[Webhook] Subscription payment marked as FAILED for Payment: ${paymentId}`
          )
        }
      } catch (dbErr) {
        console.error(
          `[Webhook DB Error] Failed to record payment failure: `,
          dbErr
        )
      }
    }
  }
}
