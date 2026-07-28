import { Request, Response } from "express"
import { PaymentService } from "./payment.service.js"

export class PaymentController {
  static async getPaymentHistory(params: { page: number; limit: number }) {
    return PaymentService.getHistory(params)
  }

  static async getSessionReceipt(sessionId: string) {
    return PaymentService.getSessionReceipt(sessionId)
  }

  static async handleWebhook(req: Request, res: Response): Promise<void> {
    console.log(
      `[Webhook Controller] Incoming Stripe webhook POST request to /webhook/stripe. Body length: ${req.body ? req.body.length : 0} bytes.`
    )
    const sig = req.headers["stripe-signature"]

    if (!sig || typeof sig !== "string") {
      console.warn(
        "[Webhook Controller Warning] Missing stripe-signature header. Rejecting request."
      )
      res.status(400).json({ error: "Missing stripe-signature header" })
      return
    }

    try {
      await PaymentService.webhookHandler(sig, req.body as Buffer)
      res.status(200).json({ received: true })
    } catch (err: any) {
      console.error(`[Webhook Controller Error] ${err.message}`)
      res.status(400).send(`Webhook Error: ${err.message}`)
    }
  }
}
