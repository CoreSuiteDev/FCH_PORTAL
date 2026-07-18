import { prisma } from "../../../infrastructure/database/prisma.js"
import { ZTCCreateNews, ZTCUpdateNews } from "@workspace/types"
import { UploadService } from "../upload/upload.service.js"

export class NewsService {
  private static async handleFeaturedImage(featuredImage?: string): Promise<string | undefined> {
    if (!featuredImage) return undefined

    let base64Data: string | null = null
    let mimetype = "image/jpeg"
    let extension = ".jpg"

    if (featuredImage.startsWith("data:")) {
      const matches = featuredImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        mimetype = matches[1] || "image/jpeg"
        base64Data = matches[2] || null

        if (mimetype.includes("png")) extension = ".png"
        else if (mimetype.includes("webp")) extension = ".webp"
        else if (mimetype.includes("gif")) extension = ".gif"
      }
    } else if (!featuredImage.startsWith("http://") && !featuredImage.startsWith("https://")) {
      base64Data = featuredImage
    }

    if (base64Data) {
      const buffer = Buffer.from(base64Data, "base64")
      const file: Express.Multer.File = {
        fieldname: "file",
        originalname: `featured-image${extension}`,
        encoding: "base64",
        mimetype,
        buffer,
        size: buffer.byteLength,
        stream: null as any,
        destination: "",
        filename: `featured-image${extension}`,
        path: "",
      }

      const uploadResult = await UploadService.uploadFile(file, "news")
      return uploadResult.url
    }

    return featuredImage
  }

  private static async deleteR2FileByUrl(url?: string | null) {
    if (!url) return

    const publicUrlBase = process.env.R2_PUBLIC_URL
    if (publicUrlBase && url.startsWith(publicUrlBase)) {
      const key = url.replace(publicUrlBase, "").replace(/^\//, "")
      if (key) {
        try {
          await UploadService.deleteFile(key)
        } catch (error) {
          console.error(`Failed to delete file from R2 (key: ${key}):`, error)
        }
      }
    }
  }

  static async createNews(data: ZTCCreateNews) {
    const featuredImageUrl = await NewsService.handleFeaturedImage(data.featuredImage ?? undefined)

    return prisma.news.create({
      data: {
        ...data,
        featuredImage: featuredImageUrl,
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
    const news = await prisma.news.findUnique({ where: { id } })
    if (!news) {
      throw new Error("News article not found")
    }

    let featuredImageUrl = news.featuredImage
    if (data.featuredImage === "" || data.featuredImage === null) {
      featuredImageUrl = null
      if (news.featuredImage) {
        await NewsService.deleteR2FileByUrl(news.featuredImage)
      }
    } else if (data.featuredImage) {
      const isNewUpload =
        data.featuredImage.startsWith("data:") ||
        (!data.featuredImage.startsWith("http://") && !data.featuredImage.startsWith("https://"))

      const uploadedUrl = await NewsService.handleFeaturedImage(data.featuredImage ?? undefined)
      featuredImageUrl = uploadedUrl ?? null

      if (isNewUpload && news.featuredImage) {
        await NewsService.deleteR2FileByUrl(news.featuredImage)
      }
    }

    return prisma.news.update({
      where: { id },
      data: {
        ...data,
        featuredImage: featuredImageUrl !== undefined ? featuredImageUrl : undefined,
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
    const news = await prisma.news.findUnique({ where: { id } })
    if (news && news.featuredImage) {
      await NewsService.deleteR2FileByUrl(news.featuredImage)
    }

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
