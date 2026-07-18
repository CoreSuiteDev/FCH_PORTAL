import { SupportService } from "./support.service.js"

export class SupportController {
  static async createTicket(userId: string, body: { subject: string; message: string }) {
    return SupportService.createTicket(userId, body)
  }

  static async getUserTickets(userId: string) {
    return SupportService.getUserTickets(userId)
  }

  static async getAllTickets(params: {
    page: number
    limit: number
    status?: any
  }) {
    return SupportService.getAllTickets(params)
  }

  static async updateTicketStatus(params: {
    ticketId: string
    status: any
    adminNote?: string
    replyMessage?: string
  }) {
    if (params.replyMessage) {
      return SupportService.resolveTicketWithEmail({
        ticketId: params.ticketId,
        status: params.status,
        adminNote: params.adminNote || "Resolved by admin",
        replyMessage: params.replyMessage,
      })
    }
    return SupportService.updateTicketStatus(params)
  }
}
