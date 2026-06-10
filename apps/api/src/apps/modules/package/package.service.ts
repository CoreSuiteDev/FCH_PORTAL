import { prisma } from "../../../infrastructure/database/prisma.js"
import { MembershipType, BillingCycle, Currency } from "../../../generated/prisma/client.js"

export class PackageService {
  /**
   * Fetch all membership packages
   */
  static async getPackages() {
    return prisma.membershipPackage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  /**
   * Find a package by its ID
   */
  static async findPackageById(id: string) {
    return prisma.membershipPackage.findUnique({
      where: { id },
    })
  }

  /**
   * Create a new membership package
   */
  static async createPackage(data: {
    name: string
    slug: string
    type: MembershipType
    billingCycle: BillingCycle
    price: number
    currency: Currency
    oktaGroup: string
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
        oktaGroup: data.oktaGroup,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    })
  }

  /**
   * Update an existing membership package
   */
  static async updatePackage(
    id: string,
    data: {
      name?: string
      slug?: string
      type?: MembershipType
      billingCycle?: BillingCycle
      price?: number
      currency?: Currency
      oktaGroup?: string
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
        oktaGroup: data.oktaGroup,
        description: data.description,
        isActive: data.isActive,
      },
    })
  }

  /**
   * Delete a membership package by ID
   */
  static async deletePackage(id: string) {
    await prisma.membershipPackage.delete({
      where: { id },
    })
    return { success: true }
  }
}
