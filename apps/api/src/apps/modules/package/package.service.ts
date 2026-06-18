import { prisma } from "../../../infrastructure/database/prisma.js"
import { MembershipType, BillingCycle, Currency } from "../../../generated/prisma/client.js"

export class PackageService {

  static async getPackages() {
    return prisma.membershipPackage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  static async findPackageById(id: string) {
    return prisma.membershipPackage.findUnique({
      where: { id },
    })
  }

  static async createPackage(data: {
    name: string
    slug: string
    type: MembershipType
    billingCycle: BillingCycle
    price: number
    currency: Currency
    description?: string
    isActive?: boolean
  }) {
    return prisma.membershipPackage.create({
      data: {
        name: data.name,
        slug: data.slug,
        type: data.type,
        billingCycle: data.billingCycle,
        price: data.price,
        currency: data.currency,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    })
  }

  static async updatePackage(
    id: string,
    data: {
      name?: string
      slug?: string
      type?: MembershipType
      billingCycle?: BillingCycle
      price?: number
      currency?: Currency
      description?: string
      isActive?: boolean
    }
  ) {
    return prisma.membershipPackage.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        type: data.type,
        billingCycle: data.billingCycle,
        price: data.price,
        currency: data.currency,
        description: data.description,
        isActive: data.isActive,
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
