export class PaymentService {
  /**
   * Fetch payment transaction history
   */
  static async getHistory() {
    return [
      { id: "tx_1", amount: 150.00, status: "succeeded", date: new Date() }
    ];
  }
}
