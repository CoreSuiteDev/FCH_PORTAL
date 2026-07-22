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
      event = await stripe.webhooks.constructEventAsync(
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
              "subscription.latest_invoice.payment_intent",
              "subscription.latest_invoice.charge",
              "invoice",
              "invoice.payment_intent",
              "invoice.charge",
            ],
          }
        )

        let chargeObj: Stripe.Charge | null = null
        let invoiceObj: any = null

        // Subscription flow: invoice is attached to the subscription
        if (expandedSession.subscription) {
          const subscription =
            expandedSession.subscription as Stripe.Subscription | null
          invoiceObj = subscription?.latest_invoice as Stripe.Invoice | null

          if (invoiceObj) {
            invoiceUrl =
              invoiceObj.hosted_invoice_url || invoiceObj.invoice_pdf || null

            if (invoiceObj.payment_intent) {
              paymentIntentId =
                typeof invoiceObj.payment_intent === "string"
                  ? invoiceObj.payment_intent
                  : invoiceObj.payment_intent.id
            }
            if (invoiceObj.charge) {
              stripeChargeId =
                typeof invoiceObj.charge === "string"
                  ? invoiceObj.charge
                  : invoiceObj.charge.id
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

            // Fallback: get payment intent / charge from invoice
            if (!paymentIntentId || !stripeChargeId) {
              if (!paymentIntentId && invoiceObj.payment_intent) {
                paymentIntentId =
                  typeof invoiceObj.payment_intent === "string"
                    ? invoiceObj.payment_intent
                    : invoiceObj.payment_intent.id
              }
              if (!stripeChargeId && invoiceObj.charge) {
                stripeChargeId =
                  typeof invoiceObj.charge === "string"
                    ? invoiceObj.charge
                    : invoiceObj.charge.id
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

          const existingDonation = await prisma.donation.findUnique({
            where: { id: donationId },
          })

          if (existingDonation) {
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
          } else {
            console.warn(
              `[Webhook Warning] Donation record ${donationId} not found in database (possibly created in another environment or deleted). Creating fallback record...`
            )
            let donator = await prisma.donator.findUnique({ where: { id: donatorId } })
            if (!donator) {
              donator = await prisma.donator.create({
                data: {
                  id: donatorId,
                  name: "Donor",
                  stripeCustomerId,
                  totalDonationAmount: amount,
                  totalDonationCount: 1,
                },
              }).catch(() => null)
            } else {
              await prisma.donator.update({
                where: { id: donatorId },
                data: {
                  stripeCustomerId,
                  totalDonationAmount: { increment: amount },
                  totalDonationCount: { increment: 1 },
                },
              }).catch(() => {})
            }

            await prisma.donation.create({
              data: {
                id: donationId,
                amount,
                currency: (metadata.currency as "USD" | "EUR") || "USD",
                status: "SUCCEEDED",
                donatorId: donator ? donator.id : donatorId,
                userId: metadata.userId && metadata.userId !== "Guest" ? metadata.userId : null,
                paymentIntentId,
                stripeChargeId,
                paymentTransactionId: stripeChargeId,
                receiptUrl,
                cardBrand,
                cardLast4,
                invoiceUrl,
              },
            }).catch((err) => {
              console.error(`[Webhook Error] Failed to create fallback donation: ${err.message}`)
            })
          }
        } else if (type === "sponsorship" && metadata.sponsorshipId) {
          const sponsorshipId = metadata.sponsorshipId
          console.log(
            `[Webhook Service] Processing sponsorship database update. Sponsorship ID: ${sponsorshipId}`
          )

          const existingSponsorship = await prisma.sponsorship.findUnique({
            where: { id: sponsorshipId },
          })

          if (existingSponsorship) {
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
          } else {
            console.warn(
              `[Webhook Warning] Sponsorship record ${sponsorshipId} not found in database. Creating fallback record...`
            )
            const planId = metadata.planId
            const sponsorId = metadata.sponsorId
            if (planId && sponsorId) {
              await prisma.sponsorship.create({
                data: {
                  id: sponsorshipId,
                  planId,
                  sponsorId,
                  userId: metadata.userId && metadata.userId !== "Guest" ? metadata.userId : null,
                  amount: metadata.amount ? new Prisma.Decimal(metadata.amount) : new Prisma.Decimal(0),
                  currency: (metadata.currency as "USD" | "EUR") || "USD",
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
              }).catch((err) => {
                console.error(`[Webhook Error] Failed to create fallback sponsorship: ${err.message}`)
              })
            }
          }
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

          // Deactivate any other active subscriptions for this user
          await prisma.subscription.updateMany({
            where: {
              userId,
              status: "ACTIVE",
              id: { not: subscriptionId },
            },
            data: {
              status: "CANCELED",
            },
          })

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
            await UserService.addUserRole(userId, roleName)
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

  static async getSessionReceipt(sessionId: string) {
    try {
      if (!sessionId) return { receiptUrl: null, transactionId: null };

      // 1. Check DB first
      const sponsorship = await prisma.sponsorship.findFirst({
        where: { OR: [{ paymentIntentId: sessionId }, { paymentTransactionId: sessionId }] },
        select: { receiptUrl: true, paymentTransactionId: true, paymentIntentId: true },
      });
      if (sponsorship?.receiptUrl) {
        return {
          receiptUrl: sponsorship.receiptUrl,
          transactionId: sponsorship.paymentTransactionId || sponsorship.paymentIntentId || sessionId,
        };
      }

      const donation = await prisma.donation.findFirst({
        where: { OR: [{ paymentIntentId: sessionId }, { paymentTransactionId: sessionId }, { stripeChargeId: sessionId }] },
        select: { receiptUrl: true, paymentTransactionId: true, paymentIntentId: true },
      });
      if (donation?.receiptUrl) {
        return {
          receiptUrl: donation.receiptUrl,
          transactionId: donation.paymentTransactionId || donation.paymentIntentId || sessionId,
        };
      }

      const payment = await prisma.payment.findFirst({
        where: { OR: [{ stripeCheckoutSessionId: sessionId }, { stripePaymentIntentId: sessionId }] },
        select: { receiptUrl: true, stripePaymentIntentId: true },
      });
      if (payment?.receiptUrl) {
        return {
          receiptUrl: payment.receiptUrl,
          transactionId: payment.stripePaymentIntentId || sessionId,
        };
      }

      // 2. Fetch directly from Stripe API
      if (process.env.STRIPE_SECRET_KEY && !sessionId.startsWith("cs_mock_")) {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["payment_intent.latest_charge"],
        });

        let receiptUrl: string | null = null;
        let transactionId: string | null = session.id;

        if (session.payment_intent && typeof session.payment_intent !== "string") {
          const pi = session.payment_intent as any;
          transactionId = pi.id || session.id;
          if (pi.latest_charge && typeof pi.latest_charge !== "string") {
            receiptUrl = pi.latest_charge.receipt_url || null;
          } else if (pi.latest_charge && typeof pi.latest_charge === "string") {
            const charge = await stripe.charges.retrieve(pi.latest_charge);
            receiptUrl = charge.receipt_url || null;
          }
        }

        return { receiptUrl, transactionId };
      }

      return { receiptUrl: null, transactionId: sessionId };
    } catch (err: any) {
      console.error("[getSessionReceipt Error]:", err);
      return { receiptUrl: null, transactionId: sessionId };
    }
  }
}
