import z from "zod";
import { router, publicProcedure, adminProcedure } from "../../../server/trpc.js";
import { InqueryController } from "./inquery.controller.js";
import {
  ZCIContactInquerySchema,
  ZCICreateInquerySchema,
  ZCIUpdateInquerySchema,
  ZCIPaginatedInqueriesSchema,
  PaginationInputSchema,
} from "@workspace/types";
import { getPaginationMeta } from "../../../utils/pagination.js";

export const inqueryRouter = router({
  create: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/inquery",
        tags: ["inquery"],
        summary: "Create a new inquiry",
        description: "Creates a new inquiry record in the database",
      },
    })
    .input(ZCICreateInquerySchema)
    .output(
      z.object({
        success: z.boolean(),
        data: ZCIContactInquerySchema,
      })
    )
    .mutation(async ({ input }) => {
      return InqueryController.createInquery(input);
    }),

  list: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/inquery/list",
        tags: ["inquery"],
        summary: "List all inquiries",
        description: "Returns a paginated list of all contact inquiries (Super Admin only)",
      },
    })
    .input(PaginationInputSchema.optional())
    .output(ZCIPaginatedInqueriesSchema)
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const { totalCount, data } = await InqueryController.listInqueries({ page, limit });
      return {
        data,
        meta: getPaginationMeta(totalCount, page, limit),
      };
    }),

  getById: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/inquery/{id}",
        tags: ["inquery"],
        summary: "Get inquiry by ID",
        description: "Returns inquiry details (Super Admin only)",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(ZCIContactInquerySchema)
    .query(async ({ input }) => {
      return InqueryController.getInqueryById({ id: input.id });
    }),

  update: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/inquery/{id}",
        tags: ["inquery"],
        summary: "Update inquiry details",
        description: "Updates fields of an existing inquiry (Super Admin only)",
      },
    })
    .input(
      z.object({
        id: z.string(),
        data: ZCIUpdateInquerySchema,
      })
    )
    .output(ZCIContactInquerySchema)
    .mutation(async ({ input }) => {
      return InqueryController.updateInquery(input.id, input.data);
    }),

  delete: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/inquery/{id}",
        tags: ["inquery"],
        summary: "Delete inquiry",
        description: "Permanently deletes an inquiry record from the database (Super Admin only)",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return InqueryController.deleteInquery({ id: input.id });
    }),
});