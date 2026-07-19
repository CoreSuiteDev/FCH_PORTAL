import { TRPCError } from "@trpc/server"
import { NewsService } from "./news.service.js"
import { ZTCCreateNews, ZTCUpdateNews } from "@workspace/types"

export class NewsController {
  static async createNews(input: ZTCCreateNews) {
    try {
      return await NewsService.createNews(input)
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Failed to create news: ${error.message}`,
      })
    }
  }

  static async getNews(id: string) {
    const news = await NewsService.getNewsById(id)
    if (!news || news.deletedAt) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `News with ID ${id} not found`,
      })
    }
    return news
  }

  static async getNewsBySlug(slug: string) {
    const news = await NewsService.getNewsBySlug(slug)
    if (!news || news.deletedAt) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `News with slug ${slug} not found`,
      })
    }
    return news
  }

  static async listNews(params: {
    page: number
    limit: number
    status?: any
    newsType?: any
    authorId?: string
    search?: string
  }) {
    try {
      return await NewsService.listAllNews(params)
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to list news articles: ${error.message}`,
      })
    }
  }

  static async updateNews(id: string, data: ZTCUpdateNews) {
    try {
      return await NewsService.updateNews(id, data)
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Failed to update news: ${error.message}`,
      })
    }
  }

  static async deleteNews(id: string) {
    try {
      return await NewsService.deleteNews(id)
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to delete news: ${error.message}`,
      })
    }
  }

  static async incrementViews(id: string) {
    try {
      return await NewsService.incrementViewCount(id)
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to increment views: ${error.message}`,
      })
    }
  }
}
