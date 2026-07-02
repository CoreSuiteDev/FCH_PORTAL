import { z } from "zod"
import { router, publicProcedure, adminProcedure } from "../../../server/trpc.js"
import { PackageController } from "./package.controller.js"
import {
  ZCIMembershipPackageSchema,
  ZCICreatePackageSchema,
  ZCIUpdatePackageSchema,
} from "@workspace/types"


const mapPackage = (pkg: any) => ({
  id: pkg.id,
  name: pkg.name,
  slug: pkg.slug,
  type: pkg.type,
  billingCycle: pkg.billingCycle,
  price: Number(pkg.price),
  currency: pkg.currency,
  description: pkg.description || undefined,
  subTitle: pkg.subTitle || undefined,
  featureTitle: pkg.featureTitle || undefined,
  features: pkg.features || undefined,
  isPopular: pkg.isPopular,
  sortOrder: pkg.sortOrder,
  isActive: pkg.isActive,
  createdAt: pkg.createdAt,
  updatedAt: pkg.updatedAt,
})


export const packageRouter = router({
  list: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/package",
        tags: ["packages"],
        summary: "List all membership packages",
        description: "Returns an array of all defined membership packages",
      },
    })
    .input(z.void())
    .output(z.array(ZCIMembershipPackageSchema))
    .query(async () => {
      const packages = await PackageController.getPackagesList()
      return packages.map(mapPackage)
    }),
  
  getBySlug: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/package/{slug}",
        tags: ["packages"],
        summary: "Get package by slug",
        description: "Returns a single package by its unique slug",
      },
    })
    .input(z.object({ slug: z.string() }))
    .output(ZCIMembershipPackageSchema)
    .query(async ({ input }) => {
      const pkg = await PackageController.getPackageBySlug(input.slug)
      if (!pkg) {
        throw new Error("Package not found")
      }
      return mapPackage(pkg)
    }),

  create: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/package",
        tags: ["packages"],
        summary: "Create a new membership package",
        description: "Provisions a new membership package with billing rules",
      },
    })
    .input(ZCICreatePackageSchema)
    .output(ZCIMembershipPackageSchema)
    .mutation(async ({ input }) => {
      const pkg = await PackageController.createPackage(input)
      return mapPackage(pkg)
    }),

  update: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/package/{id}",
        tags: ["packages"],
        summary: "Update membership package details",
        description: "Updates fields of an existing membership package",
      },
    })
    .input(
      z.object({
        id: z.string(),
        data: ZCIUpdatePackageSchema,
      })
    )
    .output(ZCIMembershipPackageSchema)
    .mutation(async ({ input }) => {
      const pkg = await PackageController.updatePackage(input.id, input.data)
      return mapPackage(pkg)
    }),

  delete: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/package/{id}",
        tags: ["packages"],
        summary: "Delete membership package",
        description: "Permanently deletes a membership package from the database",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return PackageController.deletePackage(input.id)
    }),
})
