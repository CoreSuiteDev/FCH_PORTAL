import { z } from "zod"
import { router, publicProcedure, adminProcedure } from "../../../server/trpc.js"
import { AuthorController } from "./author.controller.js"
import {
  ZCICreateAuthorSchema,
  ZCIUpdateAuthorSchema,
  ZCIAuthorOutputSchema,
  PaginationInputSchema,
} from "@workspace/types"
import { getPaginationMeta } from "../../../utils/pagination.js"

export const authorRouter = router({
  create: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/authors",
        tags: ["authors"],
        summary: "Create news author",
        description: "Creates a new author record in the database"
      },
    })
    .input(ZCICreateAuthorSchema)
    .output(ZCIAuthorOutputSchema)
    .mutation(async ({ input }) => {
      return AuthorController.createAuthor(input)
    }),

  getById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/authors/{id}",
        tags: ["authors"],
        summary: "Get author by ID",
        description: "Returns a single author details by database ID"
      },
    })
    .input(z.object({ id: z.string() }))
    .output(ZCIAuthorOutputSchema.nullable())
    .query(async ({ input }) => {
      return AuthorController.getAuthor(input.id)
    }),

  getBySlug: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/authors/slug/{slug}",
        tags: ["authors"],
        summary: "Get author by slug",
        description: "Returns a single author details by slug identifier"
      },
    })
    .input(z.object({ slug: z.string() }))
    .output(ZCIAuthorOutputSchema.nullable())
    .query(async ({ input }) => {
      return AuthorController.getAuthorBySlug(input.slug)
    }),

  list: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/authors",
        tags: ["authors"],
        summary: "List authors",
        description: "Returns a paginated list of all authors"
      },
    })
    .input(PaginationInputSchema.optional())
    .output(
      z.object({
        data: z.array(ZCIAuthorOutputSchema),
        meta: z.object({
          totalCount: z.number(),
          page: z.number(),
          limit: z.number(),
          totalPages: z.number(),
        }),
      })
    )
    .query(async ({ input }) => {
      const page = input?.page ?? 1
      const limit = input?.limit ?? 10
      const { totalCount, data } = await AuthorController.listAuthors({ page, limit })
      return {
        data: data as any,
        meta: getPaginationMeta(totalCount, page, limit),
      }
    }),

  update: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/authors/{id}",
        tags: ["authors"],
        summary: "Update author details",
        description: "Updates an existing author profile in the database"
      },
    })
    .input(
      z.object({
        id: z.string(),
        data: ZCIUpdateAuthorSchema,
      })
    )
    .output(ZCIAuthorOutputSchema)
    .mutation(async ({ input }) => {
      return AuthorController.updateAuthor(input.id, input.data)
    }),

  delete: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/authors/{id}",
        tags: ["authors"],
        summary: "Delete author",
        description: "Permanently deletes an author from the database"
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return AuthorController.deleteAuthor(input.id)
    }),
})
