import { TRPCError } from "@trpc/server"
import { ResourcesService } from "./resources.service.js"
import { ResourceVisibility } from "../../../generated/prisma/client.js"

export class ResourcesController {
  // --- Categories ---
  static async createCategory(data: { name: string; description?: string }) {
    try {
      return await ResourcesService.createCategory(data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to create category",
      })
    }
  }

  static async updateCategory(id: string, data: { name?: string; description?: string }) {
    try {
      return await ResourcesService.updateCategory(id, data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to update category",
      })
    }
  }

  static async deleteCategory(id: string) {
    try {
      await ResourcesService.deleteCategory(id)
      return { success: true }
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to delete category",
      })
    }
  }

  static async listCategories() {
    try {
      return await ResourcesService.getCategoriesList()
    } catch (err: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message || "Failed to fetch categories",
      })
    }
  }

  // --- Resources ---
  static async createResource(data: {
    title: string
    description?: string
    fileUrl: string
    fileType: string
    categoryId: string
    visibility: ResourceVisibility
  }) {
    try {
      return await ResourcesService.createResource(data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to create resource",
      })
    }
  }

  static async updateResource(
    id: string,
    data: {
      title?: string
      description?: string
      fileUrl?: string
      fileType?: string
      categoryId?: string
      visibility?: ResourceVisibility
    }
  ) {
    try {
      return await ResourcesService.updateResource(id, data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to update resource",
      })
    }
  }

  static async deleteResource(id: string) {
    try {
      await ResourcesService.deleteResource(id)
      return { success: true }
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to delete resource",
      })
    }
  }

  static async listResources(params: {
    userRole: string | undefined
    categoryId?: string
    categoryName?: string
    sortOrder?: "asc" | "desc"
  }) {
    try {
      return await ResourcesService.getResourcesList(params)
    } catch (err: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message || "Failed to fetch resources",
      })
    }
  }
}
