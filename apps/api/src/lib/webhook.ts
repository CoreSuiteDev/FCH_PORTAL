// static async webhookHandler(
  //   signature: string,
  //   rawBody: Buffer
  // ): Promise<void> {
  //   console.log(
  //     `[Webhook Service] Starting webhookHandler. Signature: ${signature ? signature.substring(0, 20) : "none"}...`
  //   )
  //   let event

  //   try {
  //     event = stripe.webhooks.constructEvent(
  //       rawBody,
  //       signature,
  //       config.stripe.webhookSecret
  //     )
  //   } catch (err: any) {
  //     if (process.env.NODE_ENV !== "production") {
  //       console.warn(
  //         `[Webhook Warning] Stripe signature verification failed: ${err.message}. Bypassing verification for local development.`
  //       )
  //       try {
  //         event = JSON.parse(rawBody.toString())
  //       } catch (parseErr: any) {
  //         throw new TRPCError({
  //           code: "BAD_REQUEST",
  //           message: `Failed to parse raw body: ${parseErr.message}`,
  //           cause: parseErr,
  //         })
  //       }
  //     } else {
  //       throw new TRPCError({
  //         code: "BAD_REQUEST",
  //         message: `Webhook signature verification failed: ${err.message}`,
  //         cause: err,
  //       })
  //     }
  //   }

  //   console.log(
  //     `[Webhook Service] Stripe event parsed successfully. Event Type: ${event.type}`
  //   )

  //   if (event.type === "checkout.session.completed") {
  //     const session = event.data.object as Stripe.Checkout.Session
  //     const metadata = session.metadata
  //     console.log(
  //       `[Webhook Service] Received checkout.session.completed for Session: ${session.id}. Metadata:`,
  //       metadata
  //     )
  //     if (!metadata) {
  //       console.warn(
  //         `[Webhook Service Warning] No metadata found in checkout session ${session.id}. Skipping.`
  //       )
  //       return
  //     }

  //     const type = metadata.type
  //     let paymentIntentId = (session.payment_intent as string) || null
  //     const stripeCustomerId = session.customer as string

  //     let receiptUrl: string | null = null
  //     let cardBrand: string | null = null
  //     let cardLast4: string | null = null
  //     let stripeChargeId: string | null = null
  //     let invoiceUrl: string | null = null

  //     try {
  //       let chargeId: string | null = null

  //       // Case A: Standard payment mode (one-time payment)
  //       if (paymentIntentId && !paymentIntentId.startsWith("pi_mock")) {
  //         const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  //         if (paymentIntent.latest_charge) {
  //           chargeId = paymentIntent.latest_charge as string
  //         }
  //       }
  //       // Case B: Subscription mode
  //       else if (session.subscription && typeof session.subscription === "string" && !session.subscription.startsWith("sub_mock")) {
  //         const subscription = await stripe.subscriptions.retrieve(session.subscription)
  //         if (subscription.latest_invoice) {
  //           const invoice = (await stripe.invoices.retrieve(subscription.latest_invoice as string)) as any
  //           invoiceUrl = invoice.hosted_invoice_url || invoice.invoice_pdf || null
  //           if (invoice.charge) {
  //             chargeId = invoice.charge as string
  //           }
  //           if (invoice.payment_intent) {
  //             paymentIntentId = invoice.payment_intent as string
  //           }
  //         }
  //       }

  //       // Retrieve charge details if chargeId was found
  //       if (chargeId) {
  //         const charge = await stripe.charges.retrieve(chargeId)
  //         stripeChargeId = charge.id
  //         receiptUrl = charge.receipt_url
  //         cardBrand = charge.payment_method_details?.card?.brand || null
  //         cardLast4 = charge.payment_method_details?.card?.last4 || null
  //       }

  //       // Retrieve standalone invoice if present on session
  //       if (!invoiceUrl && session.invoice && typeof session.invoice === "string" && !session.invoice.startsWith("in_mock")) {
  //         const invoice = await stripe.invoices.retrieve(session.invoice)
  //         invoiceUrl = invoice.hosted_invoice_url || invoice.invoice_pdf || null
  //       }

  //     } catch (error: any) {
  //       console.warn(`[Webhook] Real Stripe data retrieval failed: ${error.message}`)

  //       // Fallback for local development
  //       if (process.env.NODE_ENV !== "production") {
  //         console.log("[Webhook] Bypassing real Stripe calls and populating mock payment details for local development.")
  //         stripeChargeId = stripeChargeId || `ch_mock_${Math.random().toString(36).substring(2, 10)}`
  //         receiptUrl = receiptUrl || "https://stripe.com/receipt/mock"
  //         cardBrand = cardBrand || "Visa"
  //         cardLast4 = cardLast4 || "4242"
  //         invoiceUrl = invoiceUrl || "https://stripe.com/invoice/mock"
  //         if (!paymentIntentId) {
  //           paymentIntentId = `pi_mock_${Math.random().toString(36).substring(2, 10)}`
  //         }
  //       }
  //     }

  //     try {
  //       if (type === "donation" && metadata.donationId && metadata.donatorId) {
  //         const donationId = metadata.donationId
  //         const donatorId = metadata.donatorId
  //         const amount = metadata.amount
  //           ? new Prisma.Decimal(metadata.amount)
  //           : new Prisma.Decimal(0)

  //         console.log(
  //           `[Webhook Service] Processing donation database transaction. Donation ID: ${donationId}`
  //         )

  //         await prisma.$transaction([
  //           prisma.donation.update({
  //             where: { id: donationId },
  //             data: {
  //               status: "SUCCEEDED",
  //               paymentIntentId,
  //               stripeChargeId,
  //               paymentTransactionId: stripeChargeId,
  //               receiptUrl,
  //               cardBrand,
  //               cardLast4,
  //               invoiceUrl,
  //             },
  //           }),
  //           prisma.donator.update({
  //             where: { id: donatorId },
  //             data: {
  //               stripeCustomerId,
  //               totalDonationAmount: { increment: amount },
  //               totalDonationCount: { increment: 1 },
  //             },
  //           }),
  //         ])
  //         console.log(
  //           `[Webhook] Donation successfully recorded for: ${donationId}`
  //         )
  //       }

  //       else if (type === "sponsorship" && metadata.sponsorshipId) {
  //         const sponsorshipId = metadata.sponsorshipId
  //         console.log(`[Webhook Service] Processing sponsorship database update. Sponsorship ID: ${sponsorshipId}`)

  //         await prisma.sponsorship.update({
  //           where: { id: sponsorshipId },
  //           data: {
  //             status: "SUCCEEDED",
  //             paymentIntentId,
  //             stripeChargeId,
  //             paymentTransactionId: stripeChargeId,
  //             receiptUrl,
  //             cardBrand,
  //             cardLast4,
  //             invoiceUrl,
  //             stripeCustomerId,
  //           }
  //         })
  //         console.log(`[Webhook] Sponsorship successfully recorded for: ${sponsorshipId}`)
  //       }

  //       else if (type === "payment" && metadata.paymentId && metadata.subscriptionId && metadata.userId) {
  //         const paymentId = metadata.paymentId
  //         const subscriptionId = metadata.subscriptionId
  //         const userId = metadata.userId
  //         console.log(`[Webhook Service] Processing subscription database update. Payment ID: ${paymentId}, Subscription ID: ${subscriptionId}`)

  //         const payment = (await prisma.payment.update({
  //           where: { id: paymentId },
  //           data: {
  //             status: "SUCCEEDED",
  //             stripePaymentIntentId: paymentIntentId,
  //             stripeCheckoutSessionId: session.id,
  //             stripeInvoiceId: (typeof session.invoice === "string" ? session.invoice : session.invoice?.id) || null,
  //             receiptUrl,
  //             invoicePdfUrl: invoiceUrl,
  //             cardBrand,
  //             cardLast4,
  //           },
  //           include: {
  //             subscription: {
  //               include: {
  //                 package: true,
  //               }
  //             }
  //           }
  //         })) as any

  //         await prisma.subscription.update({
  //           where: { id: subscriptionId },
  //           data: {
  //             status: "ACTIVE",
  //             stripeCustomerId,
  //           }
  //         })

  //         if (payment.subscription) {
  //           const roleName = payment.subscription.package.type === "GENERAL" ? "MEMBER" : "PASTORAL"
  //           const { UserService } = await import("../user/user.service.js")
  //           await UserService.updateUserRole(userId, roleName)
  //         }
  //         console.log(`[Webhook] Subscription payment successfully recorded for Payment: ${paymentId}`)
  //       }
  //     } catch (dbErr) {
  //       console.error(
  //         `[Webhook DB Error] Failed to process database updates: `,
  //         dbErr
  //       )
  //       throw dbErr
  //     }
  //   }

  //   if (event.type === "charge.refunded") {
  //     const charge = event.data.object as Stripe.Charge
  //     const paymentIntentId = charge.payment_intent as string
  //     const amountRefunded = charge.amount_refunded / 100

  //     console.log(`[Webhook Service] Received charge.refunded for Payment Intent: ${paymentIntentId}. Amount refunded: $${amountRefunded}`)

  //     if (paymentIntentId) {
  //       try {
  //         // 1. Try to find and update Donation
  //         const donation = await prisma.donation.findUnique({
  //           where: { paymentIntentId }
  //         })
  //         if (donation) {
  //           await prisma.donation.update({
  //             where: { id: donation.id },
  //             data: {
  //               status: amountRefunded >= Number(donation.amount) ? "REFUNDED" : "PARTIALLY_REFUNDED",
  //               refundedAmount: amountRefunded,
  //               refundedAt: new Date(),
  //             }
  //           })
  //           console.log(`[Webhook] Donation refund updated for ID: ${donation.id}`)
  //         }

  //         // 2. Try to find and update Sponsorship
  //         const sponsorship = await prisma.sponsorship.findUnique({
  //           where: { paymentIntentId }
  //         })
  //         if (sponsorship) {
  //           await prisma.sponsorship.update({
  //             where: { id: sponsorship.id },
  //             data: {
  //               status: amountRefunded >= Number(sponsorship.amount) ? "REFUNDED" : "PARTIALLY_REFUNDED",
  //               refundedAmount: amountRefunded,
  //               refundedAt: new Date(),
  //             }
  //           })
  //           console.log(`[Webhook] Sponsorship refund updated for ID: ${sponsorship.id}`)
  //         }

  //         // 3. Try to find and update Membership Payment
  //         const payment = await prisma.payment.findFirst({
  //           where: { stripePaymentIntentId: paymentIntentId }
  //         })
  //         if (payment) {
  //           await prisma.payment.update({
  //             where: { id: payment.id },
  //             data: {
  //               status: amountRefunded >= Number(payment.amount) ? "REFUNDED" : "PARTIALLY_REFUNDED",
  //               refundedAmount: amountRefunded,
  //             }
  //           })
  //           console.log(`[Webhook] Membership payment refund updated for ID: ${payment.id}`)
  //         }
  //       } catch (dbErr) {
  //         console.error(`[Webhook DB Error] Failed to process charge.refunded: `, dbErr)
  //       }
  //     }
  //   }

  //   if (event.type === "payment_intent.payment_failed") {
  //     const paymentIntent = event.data.object as Stripe.PaymentIntent
  //     const metadata = paymentIntent.metadata
  //     if (!metadata) return

  //     const errorMessage = paymentIntent.last_payment_error?.message ?? "Unknown error"
  //     const type = metadata.type

  //     try {
  //       if (type === "donation" && metadata.donationId) {
  //         const donationId = metadata.donationId
  //         await prisma.donation.update({
  //           where: { id: donationId },
  //           data: {
  //             status: "FAILED",
  //             failureReason: errorMessage,
  //           }
  //         })
  //         console.log(`[Webhook] Donation marked as FAILED for ID: ${donationId}`)
  //       }

  //       else if (type === "sponsorship" && metadata.sponsorshipId) {
  //         const sponsorshipId = metadata.sponsorshipId
  //         await prisma.sponsorship.update({
  //           where: { id: sponsorshipId },
  //           data: {
  //             status: "FAILED",
  //             errorMessage,
  //           }
  //         })
  //         console.log(`[Webhook] Sponsorship marked as FAILED for ID: ${sponsorshipId}`)
  //       }

  //       else if (type === "payment" && metadata.paymentId && metadata.subscriptionId) {
  //         const paymentId = metadata.paymentId
  //         const subscriptionId = metadata.subscriptionId

  //         await prisma.$transaction([
  //           prisma.payment.update({
  //             where: { id: paymentId },
  //             data: {
  //               status: "FAILED",
  //               failureMessage: errorMessage,
  //             }
  //           }),
  //           prisma.subscription.update({
  //             where: { id: subscriptionId },
  //             data: {
  //               status: "CANCELED",
  //             }
  //           })
  //         ])
  //         console.log(`[Webhook] Subscription payment marked as FAILED for Payment: ${paymentId}`)
  //       }
  //     } catch (dbErr) {
  //       console.error(`[Webhook DB Error] Failed to record payment failure: `, dbErr)
  //     }
  //   }
  // }