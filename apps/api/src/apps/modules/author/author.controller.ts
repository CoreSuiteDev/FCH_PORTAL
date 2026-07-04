import { TRPCError } from "@trpc/server"
import { AuthorService } from "./author.service.js"
import { ZTCCreateAuthor, ZTCUpdateAuthor } from "@workspace/types"

export class AuthorController {
  static async createAuthor(input: ZTCCreateAuthor) {
    try {
      return await AuthorService.createAuthor(input)
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Failed to create author: ${error.message}`,
      })
    }
  }

  static async getAuthor(id: string) {
    const author = await AuthorService.getAuthorById(id)
    if (!author) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Author with ID ${id} not found`,
      })
    }
    return author
  }

  static async getAuthorBySlug(slug: string) {
    const author = await AuthorService.getAuthorBySlug(slug)
    if (!author) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Author with slug ${slug} not found`,
      })
    }
    return author
  }

  static async listAuthors(params: { page: number; limit: number }) {
    try {
      return await AuthorService.listAllAuthors(params)
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to list authors: ${error.message}`,
      })
    }
  }

  static async updateAuthor(id: string, data: ZTCUpdateAuthor) {
    try {
      return await AuthorService.updateAuthor(id, data)
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Failed to update author: ${error.message}`,
      })
    }
  }

  static async deleteAuthor(id: string) {
    try {
      return await AuthorService.deleteAuthor(id)
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to delete author: ${error.message}`,
      })
    }
  }
}
