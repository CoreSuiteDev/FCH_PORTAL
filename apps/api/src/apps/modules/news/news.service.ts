import { prisma } from "../../../infrastructure/database/prisma.js"
import { ZTCCreateNews, ZTCUpdateNews } from "@workspace/types"

export class NewsService {
  static async createNews(data: ZTCCreateNews) {
    return prisma.news.create({
      data: {
        ...data,
        tags: data.tags
          ? {
              connectOrCreate: data.tags.map((tag: any) => ({
                where: { slug: tag.slug },
                create: { name: tag.name, slug: tag.slug },
              })),
            }
          : undefined,
      },
      include: {
        author: true,
        tags: true,
      },
    })
  }

  static async getNewsById(id: string) {
    return prisma.news.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
      },
    })
  }

  static async getNewsBySlug(slug: string) {
    return prisma.news.findUnique({
      where: { slug },
      include: {
        author: true,
        tags: true,
      },
    })
  }

  static async listAllNews(params: {
    page: number
    limit: number
    status?: any
    newsType?: any
    authorId?: string
  }) {
    const { page, limit, status, newsType, authorId } = params
    const skip = (page - 1) * limit

    const where: any = {
      deletedAt: null,
      status: status || undefined,
      newsType: newsType || undefined,
      authorId: authorId || undefined,
    }

    const [totalCount, data] = await prisma.$transaction([
      prisma.news.count({ where }),
      prisma.news.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          tags: true,
        },
      }),
    ])

    return { totalCount, data }
  }

  static async updateNews(id: string, data: ZTCUpdateNews) {
    return prisma.news.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags
          ? {
              set: [], // Clear tags
              connectOrCreate: data.tags.map((tag: any) => ({
                where: { slug: tag.slug },
                create: { name: tag.name, slug: tag.slug },
              })),
            }
          : undefined,
      },
      include: {
        author: true,
        tags: true,
      },
    })
  }

  static async deleteNews(id: string) {
    // Soft delete
    await prisma.news.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return { success: true }
  }

  static async incrementViewCount(id: string) {
    return prisma.news.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  }
}
