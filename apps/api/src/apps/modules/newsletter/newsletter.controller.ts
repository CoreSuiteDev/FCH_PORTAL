import { TRPCError } from "@trpc/server"
import { NewsletterService } from "./newsletter.service.js"

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
}
