import { router, publicProcedure } from "../../../server/trpc.js";
import { NewsletterController } from "./newsletter.controller.js";
import { ZCICreateNewsletterSchema, ZCICNewsletterSchema } from "@workspace/types";
import { z } from "zod";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/newsletter/subscribe",
        tags: ["newsletter"],
        summary: "Subscribe to newsletter",
        description: "Registers a new email address for newsletter subscription",
      },
    })
    .input(ZCICreateNewsletterSchema)
    .output(
      z.object({
        success: z.boolean(),
        data: ZCICNewsletterSchema,
      })
    )
    .mutation(async ({ input }) => {
      return NewsletterController.subscribe(input);
    }),
});
