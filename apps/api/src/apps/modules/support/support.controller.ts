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
  }) {
    return SupportService.updateTicketStatus(params)
  }
}
