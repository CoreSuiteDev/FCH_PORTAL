import { prisma } from "../../../infrastructure/database/prisma.js"
import { ZTCCreateAuthor, ZTCUpdateAuthor } from "@workspace/types"

export class AuthorService {
  static async createAuthor(data: ZTCCreateAuthor) {
    return prisma.author.create({
      data,
    })
  }

  static async getAuthorById(id: string) {
    return prisma.author.findUnique({
      where: { id },
      include: {
        _count: {
          select: { news: true },
        },
      },
    })
  }

  static async getAuthorBySlug(slug: string) {
    return prisma.author.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { news: true },
        },
      },
    })
  }

  static async listAllAuthors(params: { page: number; limit: number }) {
    const { page, limit } = params
    const skip = (page - 1) * limit

    const [totalCount, data] = await prisma.$transaction([
      prisma.author.count(),
      prisma.author.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { news: true },
          },
        },
      }),
    ])

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
