import { prisma } from "../../../infrastructure/database/prisma.js"

export class PaymentService {
  /**
   * Fetch payment transaction history
   */
  static async getHistory() {
    const payments = await prisma.payment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return payments.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      status: p.status,
      date: p.createdAt,
    }))
  }
}

