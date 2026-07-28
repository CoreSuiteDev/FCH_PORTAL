import { z } from "zod"
import { router, protectedProcedure, adminProcedure } from "../../../server/trpc.js"
import { SupportController } from "./support.controller.js"
import { getPaginationMeta } from "../../../utils/pagination.js"

export const supportRouter = router({
  createTicket: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/support/tickets",
        tags: ["support"],
        summary: "Create a new support ticket",
        description: "Creates a support request ticket linked to the logged-in user",
      },
    })
    .input(
      z.object({
        subject: z.string().min(3),
        message: z.string().min(10),
      })
    )
    .output(z.any())
    .mutation(async ({ input, ctx }) => {
      return SupportController.createTicket(ctx.user.id, input)
    }),

  myTickets: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/support/tickets/my",
        tags: ["support"],
        summary: "List current user's tickets",
        description: "Returns a list of support tickets submitted by the authenticated user",
      },
    })
    .input(z.void())
    .output(z.any())
    .query(async ({ ctx }) => {
      return SupportController.getUserTickets(ctx.user.id)
    }),

  listTickets: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/support/tickets/admin",
        tags: ["support"],
        summary: "List all support tickets in system",
        description: "Returns all support tickets for administrative processing (Admin only)",
      },
    })
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
        status: z.enum(["PENDING", "OPEN", "RESOLVED", "CLOSED"]).optional(),
      }).optional()
    )
    .output(z.any())
    .query(async ({ input }) => {
      const page = input?.page ?? 1
      const limit = input?.limit ?? 10
      const status = input?.status

      const { totalCount, data } = await SupportController.getAllTickets({
        page,
        limit,
        status,
      })

      return {
        data,
        meta: getPaginationMeta(totalCount, page, limit),
      }
    }),

  updateTicketStatus: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/support/tickets/{ticketId}/process",
        tags: ["support"],
        summary: "Update ticket status",
        description: "Updates status of support tickets and appends admin resolution notes (Admin only)",
      },
    })
    .input(
      z.object({
        ticketId: z.string(),
        status: z.enum(["PENDING", "OPEN", "RESOLVED", "CLOSED"]),
        adminNote: z.string().optional(),
        replyMessage: z.string().optional(),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      return SupportController.updateTicketStatus(input)
    }),
})
