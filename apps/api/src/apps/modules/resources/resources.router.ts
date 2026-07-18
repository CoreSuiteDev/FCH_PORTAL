import { z } from "zod"
import { router, protectedProcedure, adminProcedure } from "../../../server/trpc.js"
import { ResourcesController } from "./resources.controller.js"

export const resourcesRouter = router({
  // --- Categories (Public/User routes to get, Admin routes to mutate) ---
  listCategories: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/resources/categories",
        tags: ["resources"],
        summary: "Get resource categories list",
        description: "Returns list of all resource categories",
      },
    })
    .input(z.void())
    .output(z.array(z.any()))
    .query(async () => {
      return ResourcesController.listCategories()
    }),

  createCategory: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/resources/categories",
        tags: ["resources"],
        summary: "Create resource category",
        description: "Creates a new category for resource grouping (Super Admin only)",
      },
    })
    .input(
      z.object({
        name: z.string().min(1, "Category name is required"),
        description: z.string().optional(),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      return ResourcesController.createCategory(input)
    }),

  updateCategory: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/resources/categories/{id}",
        tags: ["resources"],
        summary: "Update resource category",
        description: "Updates an existing resource category details (Super Admin only)",
      },
    })
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return ResourcesController.updateCategory(id, data)
    }),

  deleteCategory: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/resources/categories/{id}",
        tags: ["resources"],
        summary: "Delete resource category",
        description: "Deletes a resource category by ID (Super Admin only)",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .mutation(async ({ input }) => {
      return ResourcesController.deleteCategory(input.id)
    }),

  // --- General Resources ---
  list: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/resources",
        tags: ["resources"],
        summary: "List resources based on user role and category",
        description: "Returns general resources matching user's permissions",
      },
    })
    .input(
      z.object({
        categoryId: z.string().optional(),
        categoryName: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
    )
    .output(z.array(z.any()))
    .query(async ({ input, ctx }) => {
      return ResourcesController.listResources({
        userRole: ctx.role,
        categoryId: input.categoryId,
        categoryName: input.categoryName,
        sortOrder: input.sortOrder,
      })
    }),

  create: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/resources",
        tags: ["resources"],
        summary: "Create resource",
        description: "Uploads a new resource metadata (Super Admin only)",
      },
    })
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        fileUrl: z.string().url("Must be a valid URL"),
        fileType: z.string().min(1, "File type is required"),
        categoryId: z.string().min(1, "Category ID is required"),
        visibility: z.enum(["MEMBER", "PASTORAL", "BOARD", "ADMIN", "COMMITTEE", "SUPER_ADMIN"]),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      return ResourcesController.createResource(input)
    }),

  update: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/resources/{id}",
        tags: ["resources"],
        summary: "Update resource details",
        description: "Updates resource metadata details (Super Admin only)",
      },
    })
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        fileUrl: z.string().url("Must be a valid URL").optional(),
        fileType: z.string().optional(),
        categoryId: z.string().optional(),
        visibility: z.enum(["MEMBER", "PASTORAL", "BOARD", "ADMIN", "COMMITTEE", "SUPER_ADMIN"]).optional(),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return ResourcesController.updateResource(id, data)
    }),

  delete: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/resources/{id}",
        tags: ["resources"],
        summary: "Delete resource",
        description: "Permanently deletes a resource from database (Super Admin only)",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .mutation(async ({ input }) => {
      return ResourcesController.deleteResource(input.id)
    }),
})
