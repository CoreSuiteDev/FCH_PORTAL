import { Request, Response } from "express";
import { DonationService, PaymentService } from "./payment.service.js";

export class PaymentController {
  static async getPaymentHistory(params: { page: number; limit: number }) {
    return PaymentService.getHistory(params);
  }
}

export class DonationController {
  static async createDonation(body: Parameters<typeof DonationService.createStripeDonation>[0]) {
    return DonationService.createStripeDonation(body);
  }


  static async handleWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"];

    if (!sig || typeof sig !== "string") {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }

    try {
      await DonationService.webhookHandler(sig, req.body as Buffer);
      res.status(200).json({ received: true });
    } catch (err: any) {
      // Only reaches here if signature verification failed (intentional 400)
      console.error(`[webhook] ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  static async getDonationHistory(params: {page: number, limit: number}){
    return DonationService.getDonationHistory(params);
  }
}
