import { PaymentService } from "./payment.service.js";

export class PaymentController {
  /**
   * Controller for resolving payment history
   */
  static async getPaymentHistory() {
    return PaymentService.getHistory();
  }
}
