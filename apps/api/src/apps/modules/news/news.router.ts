import { z } from "zod"
import { router, publicProcedure, adminProcedure } from "../../../server/trpc.js"
import { NewsController } from "./news.controller.js"
import {
  ZCICreateNewsSchema,
  ZCIUpdateNewsSchema,
  ZCINewsOutputSchema,
  PublishStatusEnum,
  NewsTypeEnum,
} from "@workspace/types"
import { getPaginationMeta } from "../../../utils/pagination.js"

export const newsRouter = router({
  create: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/news",
        tags: ["news"],
        summary: "Create news article",
        description: "Creates a new news or blog entry in the database"
      },
    })
    .input(ZCICreateNewsSchema)
    .output(ZCINewsOutputSchema)
    .mutation(async ({ input }) => {
      return NewsController.createNews(input)
    }),

  getById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/news/{id}",
        tags: ["news"],
        summary: "Get news by ID",
        description: "Returns a news article details by database ID"
      },
    })
    .input(z.object({ id: z.string() }))
    .output(ZCINewsOutputSchema.nullable())
    .query(async ({ input }) => {
      return NewsController.getNews(input.id)
    }),

  getBySlug: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/news/slug/{slug}",
        tags: ["news"],
        summary: "Get news by slug",
        description: "Returns a news article details by slug identifier"
      },
    })
    .input(z.object({ slug: z.string() }))
    .output(ZCINewsOutputSchema.nullable())
    .query(async ({ input }) => {
      return NewsController.getNewsBySlug(input.slug)
    }),

  list: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/news",
        tags: ["news"],
        summary: "List news articles",
        description: "Returns a paginated list of news articles with optional filters"
      },
    })
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        status: PublishStatusEnum.optional(),
        newsType: NewsTypeEnum.optional(),
        authorId: z.string().optional(),
      })
    )
    .output(
      z.object({
        data: z.array(ZCINewsOutputSchema),
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
      const { totalCount, data } = await NewsController.listNews({
        page,
        limit,
        status: input?.status,
        newsType: input?.newsType,
        authorId: input?.authorId,
      })
      return {
        data: data as any,
        meta: getPaginationMeta(totalCount, page, limit),
      }
    }),

  update: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/news/{id}",
        tags: ["news"],
        summary: "Update news article",
        description: "Updates an existing news article in the database"
      },
    })
    .input(
      z.object({
        id: z.string(),
        data: ZCIUpdateNewsSchema,
      })
    )
    .output(ZCINewsOutputSchema)
    .mutation(async ({ input }) => {
      return NewsController.updateNews(input.id, input.data)
    }),

  delete: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/news/{id}",
        tags: ["news"],
        summary: "Delete news article",
        description: "Soft deletes a news article by ID"
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return NewsController.deleteNews(input.id)
    }),

  incrementViews: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/news/{id}/views",
        tags: ["news"],
        summary: "Increment view count",
        description: "Increments views analytical count for a news article by database ID"
      },
    })
    .input(z.object({ id: z.string() }))
    .output(ZCINewsOutputSchema)
    .mutation(async ({ input }) => {
      return NewsController.incrementViews(input.id)
    }),
})
