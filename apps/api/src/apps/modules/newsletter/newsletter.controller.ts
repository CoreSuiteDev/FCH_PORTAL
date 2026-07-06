import { TRPCError } from "@trpc/server"
import { NewsletterService } from "./newsletter.service.js"
import { prisma } from "../../../infrastructure/database/prisma.js"

export class NewsletterController {
  static async subscribe(input: { firstName: string; lastName?: string; email: string }) {
    try {
      const subscriber = await NewsletterService.subscribe(input)
      return {
        success: true,
        data: subscriber,
      }
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Subscription failed: ${error.message}`,
      })
    }
  }

  static async listSubscribers(params: { page: number; limit: number }) {
    try {
      return await NewsletterService.findAllSubscribers(params)
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to retrieve subscribers: ${error.message}`,
      })
    }
  }

  static async deleteSubscriber({ id }: { id: string }) {
    try {
      const exists = await prisma.newsletterSubscriber.findUnique({
        where: { id },
      })
      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Subscriber with ID ${id} not found`,
        })
      }
      return await NewsletterService.deleteSubscriber(id)
    } catch (error: any) {
      if (error instanceof TRPCError) throw error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to delete subscriber: ${error.message}`,
      })
    }
  }
}
