import { prisma } from "../../../infrastructure/database/prisma.js"
import { ZTCCreateAuthor, ZTCUpdateAuthor } from "@workspace/types"

export class AuthorService {
  static async createAuthor(data: ZTCCreateAuthor) {
    return prisma.author.create({
      data,
    })
  }

  static async getAuthorById(id: string) {
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        news: {
          select: { status: true },
        },
        _count: {
          select: { news: true },
        },
      },
    })
    if (!author) return null
    const publishedCount = author.news.filter((n) => n.status === "PUBLISHED").length
    const unpublishedCount = author.news.length - publishedCount
    const { news, ...rest } = author
    return {
      ...rest,
      publishedCount,
      unpublishedCount,
    }
  }

  static async getAuthorBySlug(slug: string) {
    const author = await prisma.author.findUnique({
      where: { slug },
      include: {
        news: {
          select: { status: true },
        },
        _count: {
          select: { news: true },
        },
      },
    })
    if (!author) return null
    const publishedCount = author.news.filter((n) => n.status === "PUBLISHED").length
    const unpublishedCount = author.news.length - publishedCount
    const { news, ...rest } = author
    return {
      ...rest,
      publishedCount,
      unpublishedCount,
    }
  }

  static async listAllAuthors(params: { page: number; limit: number }) {
    const { page, limit } = params
    const skip = (page - 1) * limit

    const [totalCount, authors] = await prisma.$transaction([
      prisma.author.count(),
      prisma.author.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          news: {
            select: { status: true },
          },
          _count: {
            select: { news: true },
          },
        },
      }),
    ])

    const data = authors.map((author) => {
      const publishedCount = author.news.filter((n) => n.status === "PUBLISHED").length
      const unpublishedCount = author.news.length - publishedCount
      const { news, ...rest } = author
      return {
        ...rest,
        publishedCount,
        unpublishedCount,
      }
    })

    return { totalCount, data }
  }

  static async updateAuthor(id: string, data: ZTCUpdateAuthor) {
    return prisma.author.update({
      where: { id },
      data,
    })
  }

  static async deleteAuthor(id: string) {
    await prisma.author.delete({
      where: { id },
    })
    return { success: true }
  }
}
