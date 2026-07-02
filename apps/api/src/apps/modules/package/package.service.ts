import { ZTCCreatePackage, ZTCUpdatePackage } from "@workspace/types"
import { prisma } from "../../../infrastructure/database/prisma.js"

export class PackageService {
  static async getPackages() {
    return prisma.membershipPackage.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    })
  }

  static async getPackageBySlug(slug: string) {
    return prisma.membershipPackage.findUnique({
      where: { slug },
    })
  }

  static async createPackage(data: ZTCCreatePackage) {
    const { name, billingCycle, currency, isActive, isPopular, price, slug, sortOrder, type, description, featureTitle, features, subTitle } = data

    return prisma.membershipPackage.create({
      data: {
        name,
        billingCycle,
        currency,
        isActive,
        isPopular,
        price,
        slug,
        sortOrder,
        type,
        description,
        featureTitle,
        features: features ?? undefined,
        subTitle,
      },
    })
  }

  static async updatePackage(id: string, data: ZTCUpdatePackage) {
    return prisma.membershipPackage.update({
      where: { id },
      data: {
        name: data.name,
        billingCycle: data.billingCycle,
        currency: data.currency,
        isActive: data.isActive,
        isPopular: data.isPopular,
        price: data.price,
        slug: data.slug,
        sortOrder: data.sortOrder,
        type: data.type,
        description: data.description,
        featureTitle: data.featureTitle,
        features: data.features ?? undefined,
        subTitle: data.subTitle,
      },
    })
  }

  static async deletePackage(id: string) {
    await prisma.membershipPackage.delete({
      where: { id },
    })
    return { success: true }
  }
}
