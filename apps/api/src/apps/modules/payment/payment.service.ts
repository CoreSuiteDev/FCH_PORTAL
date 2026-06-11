import { prisma } from "../../../infrastructure/database/prisma.js"

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
        orderBy: {
          createdAt: "desc",
        },
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
}

