import { prisma } from "../../../infrastructure/database/prisma.js"
import { TicketStatus } from "../../../generated/prisma/client.js"

export class SupportService {
  /**
   * Create a new support ticket
   */
  static async createTicket(userId: string, data: { subject: string; message: string }) {
    return prisma.supportTicket.create({
      data: {
        userId,
        subject: data.subject,
        message: data.message,
        status: "PENDING",
      },
    })
  }

  /**
   * List all support tickets for a specific user
   */
  static async getUserTickets(userId: string) {
    return prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * List all support tickets in the system (for Admin overview)
   */
  static async getAllTickets(params: {
    page: number
    limit: number
    status?: TicketStatus
  }) {
    const { page, limit, status } = params
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [totalCount, data] = await prisma.$transaction([
      prisma.supportTicket.count({ where }),
      prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    return { totalCount, data }
  }

  /**
   * Update support ticket status (Admin resolution)
   */
  static async updateTicketStatus(params: {
    ticketId: string
    status: TicketStatus
    adminNote?: string
  }) {
    const { ticketId, status, adminNote } = params

    return prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status,
        adminNote: adminNote ?? null,
      },
    })
  }
}
