import { PaymentService } from "./payment.service.js";

export class PaymentController {
  /**
   * Controller for resolving payment history (paginated)
   */
  static async getPaymentHistory(params: { page: number; limit: number }) {
    return PaymentService.getHistory(params);
  }
}
