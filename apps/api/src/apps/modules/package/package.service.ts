import { TRPCError } from "@trpc/server"
import { ZTCCreatePackage, ZTCUpdatePackage } from "@workspace/types"
import { prisma } from "../../../infrastructure/database/prisma.js"

export class PackageService {
  static async getPackages(filter?: { isActive?: boolean }) {
    return prisma.membershipPackage.findMany({
      where: filter,
      orderBy: {
        sortOrder: "asc",
      },
    })
  }

  static async getPackageBySlug(identifier: string) {
    const pkg = await prisma.membershipPackage.findFirst({
      where: {
        OR: [{ slug: identifier }, { id: identifier }],
      },
    })
    if (!pkg) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Membership package '${identifier}' not found`,
      })
    }

    return pkg
  }

  static async createPackage(data: ZTCCreatePackage) {

    const existingPackage = await prisma.membershipPackage.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    })
    if (existingPackage)
      throw new Error(`A Pacakge with the slug '${data.slug}' already exists.`)

    return prisma.membershipPackage.create({
      data: {
        ...data,
        features: data.features ?? undefined,
      },
    })
  }

  static async updatePackage(id: string, data: ZTCUpdatePackage) {
   try {
    return await prisma.membershipPackage.update({
      where: {id},
      data: {
        ...data,
        features: data.features ?? undefined
      }
    })
   } catch (error: any) {
      if (error.code === "P2025") {
      throw new Error(`Package with ID '${id}' not exist.`)
    }
    throw error;
   }
  }

  static async deletePackage(id: string) {
   try {
    await prisma.membershipPackage.delete({
      where: {id}
    })
    return {success: true};
   } catch (error: any) {
    if (error.code === "P2025") {
      throw new Error(`Package with ID '${id}' does not exist.`)  
    }
    throw error
   }
  }
}
