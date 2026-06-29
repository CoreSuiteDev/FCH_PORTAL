import { TRPCError } from "@trpc/server";
import { ZTDonationInput } from "@workspace/types/index.js";
import { prisma } from "../../../infrastructure/database/prisma.js";
import { stripe } from "../../../infrastructure/stripe/stripe.js";
import config from "../../../utils/config.js";

// ---------------------------------------------------------------------------
// PaymentService — generic payment history
// ---------------------------------------------------------------------------

export class PaymentService {
  /**
   * Fetch payment transaction history (paginated)
   */
  static async getHistory(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [totalCount, payments] = await prisma.$transaction([
      prisma.payment.count(),
      prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const data = payments.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      status: p.status,
      date: p.createdAt,
    }));

    return { totalCount, data };
  }
}

// ---------------------------------------------------------------------------
// DonationService
// ---------------------------------------------------------------------------

export class DonationService {
  /**
   * Create a Stripe PaymentIntent and persist a PENDING Donation record.
   * Returns the clientSecret needed by the frontend to confirm payment.
   */
  static async createStripeDonation(body: ZTDonationInput) {
    const { amount, currency, description, name, email, phone, userId, paymentMethodId } = body;

    // Upsert donator — handles repeat donors with the same email gracefully
    const donator = await prisma.donator.upsert({
      where: { email },
      update: { name, phone: phone ?? undefined },
      create: { name, email, phone: phone ?? undefined },
    });

    const amountInCents = Math.round(amount * 100);

    let paymentIntent;
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
      });
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Stripe error",
        cause: err,
      });
    }

    // Retrieve receipt details from latest charge if succeeded immediately
    let receiptUrl: string | null = null;
    let paymentMethod: string | null = null;
    let cardBrand: string | null = null;
    let cardLast4: string | null = null;

    if (paymentIntent.status === "succeeded" && paymentIntent.latest_charge) {
      try {
        const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);
        receiptUrl = charge.receipt_url ?? null;
        paymentMethod = charge.payment_method_details?.type ?? null;
        cardBrand = charge.payment_method_details?.card?.brand ?? null;
        cardLast4 = charge.payment_method_details?.card?.last4 ?? null;
      } catch (chargeErr) {
        console.warn(`[createStripeDonation] Could not retrieve charge details:`, chargeErr);
      }
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
        paymentMethod,
        cardBrand,
        cardLast4,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      donationId: donation.id,
    };
  }

  /**
   * Handle incoming Stripe webhook events.
   *
   * IMPORTANT: `rawBody` must be the raw Buffer — express.raw() must be used
   * on this route, NOT express.json(). If the body has been parsed already,
   * Stripe's signature verification will throw.
   *
   * Always resolves (never throws) so the caller can return HTTP 200 to Stripe.
   * Stripe will retry on non-2xx, which can cause duplicate processing.
   */
  static async webhookHandler(signature: string, rawBody: Buffer): Promise<void> {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        config.stripe.webhookSecret,
      );
    } catch (err: any) {
      // Re-throw so the controller can return 400 — bad signature means
      // this is not a genuine Stripe request.
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Webhook signature verification failed: ${err.message}`,
        cause: err,
      });
    }

    const paymentIntent = event.data.object as any;

    // Retrieve the Charge to get receipt URL and card details
    let charge: Awaited<ReturnType<typeof stripe.charges.retrieve>> | null = null;
    if (paymentIntent.latest_charge) {
      try {
        charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
      } catch (err: any) {
        // Non-fatal — proceed without charge details
        console.warn(`[webhook] Could not retrieve charge ${paymentIntent.latest_charge}: ${err.message}`);
      }
    }

    const receiptUrl = charge?.receipt_url ?? null;
    const paymentMethod = charge?.payment_method_details?.type ?? null;
    const cardBrand = charge?.payment_method_details?.card?.brand ?? null;
    const cardLast4 = charge?.payment_method_details?.card?.last4 ?? null;
    const errorMessage = paymentIntent.last_payment_error?.message ?? null;
    const customerId = (paymentIntent.customer as string | null) ?? null;

    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          await prisma.donation.update({
            where: { paymentIntentId: paymentIntent.id },
            data: {
              status: "SUCCEEDED",
              receiptUrl,
              paymentMethod,
              cardBrand,
              cardLast4,
              stripeCustomerId: customerId,
            },
          });
          console.log(`[webhook] Donation SUCCEEDED — PaymentIntent: ${paymentIntent.id}`);
          break;

        case "payment_intent.payment_failed":
          await prisma.donation.update({
            where: { paymentIntentId: paymentIntent.id },
            data: {
              status: "FAILED",
              errorMessage,
              stripeCustomerId: customerId,
            },
          });
          console.log(`[webhook] Donation FAILED — PaymentIntent: ${paymentIntent.id}`);
          break;

        default:
          console.log(`[webhook] Unhandled event type: ${event.type}`);
      }
    } catch (dbErr: any) {
      // Log but do NOT re-throw — we must return 200 to Stripe to prevent
      // infinite retries. Investigate DB errors separately.
      console.error("[webhook] DB update failed:", dbErr);
    }
  }
}