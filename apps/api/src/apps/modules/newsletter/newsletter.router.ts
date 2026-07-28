import { router, publicProcedure, adminProcedure } from "../../../server/trpc.js";
import { NewsletterController } from "./newsletter.controller.js";
import {
  ZCICreateNewsletterSchema,
  ZCICNewsletterSchema,
  ZCIPaginatedNewslettersSchema,
  PaginationInputSchema,
} from "@workspace/types";
import { z } from "zod";
import { getPaginationMeta } from "../../../utils/pagination.js";

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

  list: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/newsletter/list",
        tags: ["newsletter"],
        summary: "List all newsletter subscribers",
        description: "Returns a paginated list of all newsletter subscribers (Super Admin only)",
      },
    })
    .input(PaginationInputSchema.optional())
    .output(ZCIPaginatedNewslettersSchema)
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const { totalCount, data } = await NewsletterController.listSubscribers({ page, limit });
      return {
        data,
        meta: getPaginationMeta(totalCount, page, limit),
      };
    }),

  delete: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/newsletter/{id}",
        tags: ["newsletter"],
        summary: "Delete newsletter subscriber",
        description: "Permanently deletes a newsletter subscriber (Super Admin only)",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return NewsletterController.deleteSubscriber({ id: input.id });
    }),
});
