import { prisma } from "../../../infrastructure/database/prisma.js"
import { ResourceVisibility } from "../../../generated/prisma/client.js"

export const RESOURCE_ROLE_HIERARCHY: Record<string, number> = {
  GUEST: 0,
  MEMBER: 1,
  PASTORAL: 2,
  BOARD: 3,
  SUPER_ADMIN: 4,
}

export const RESOURCE_VISIBILITY_LEVEL: Record<ResourceVisibility, number> = {
  MEMBER: 1,
  PASTORAL: 2,
  BOARD: 3,
  ADMIN: 4,
  COMMITTEE: 4,
  SUPER_ADMIN: 4,
}

export class ResourcePolicy {
  /**
   * Returns a list of all visibility settings the user's role can view
   */
  static getAllowedVisibilities(userRole: string | undefined): ResourceVisibility[] {
    const role = userRole ? userRole.toUpperCase() : "GUEST"
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      return ["MEMBER", "PASTORAL", "BOARD", "ADMIN", "COMMITTEE", "SUPER_ADMIN"]
    }
    const userScore = RESOURCE_ROLE_HIERARCHY[role] ?? 0
    return Object.entries(RESOURCE_VISIBILITY_LEVEL)
      .filter(([_, level]) => level <= userScore)
      .map(([vis]) => vis as ResourceVisibility)
  }
}

export class ResourcesService {
  /**
   * Create a new category
   */
  static async createCategory(data: { name: string; description?: string }) {
    return prisma.resourceCategory.create({
      data: {
        name: data.name,
        description: data.description,
      },
    })
  }

  /**
   * Update an existing category
   */
  static async updateCategory(id: string, data: { name?: string; description?: string }) {
    return prisma.resourceCategory.update({
      where: { id },
      data,
    })
  }

  /**
   * Delete a category
   */
  static async deleteCategory(id: string) {
    return prisma.resourceCategory.delete({
      where: { id },
    })
  }

  /**
   * Fetch all resource categories
   */
  static async getCategoriesList() {
    return prisma.resourceCategory.findMany({
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Create a new general resource
   */
  static async createResource(data: {
    title: string
    description?: string
    fileUrl: string
    fileType: string
    categoryId: string
    visibility: ResourceVisibility
  }) {
    return prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        categoryId: data.categoryId,
        visibility: data.visibility,
      },
      include: {
        category: true,
      },
    })
  }

  /**
   * Update a resource
   */
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
    return prisma.resource.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    })
  }

  /**
   * Delete a resource
   */
  static async deleteResource(id: string) {
    return prisma.resource.delete({
      where: { id },
    })
  }

  /**
   * Fetch resources list matching visibility and optional category
   */
  static async getResourcesList(params: {
    userRole: string | undefined
    categoryId?: string
    categoryName?: string
    sortOrder?: "asc" | "desc"
  }) {
    const allowedVisibilities = ResourcePolicy.getAllowedVisibilities(params.userRole)

    const where: any = {
      visibility: {
        in: allowedVisibilities,
      },
    }

    if (params.categoryId) {
      where.categoryId = params.categoryId
    }

    if (params.categoryName) {
      where.category = {
        name: {
          equals: params.categoryName,
          mode: "insensitive",
        },
      }
    }

    return prisma.resource.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: params.sortOrder || "desc" },
    })
  }
}
