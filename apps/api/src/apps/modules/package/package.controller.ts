import { PackageService } from "./package.service.js"
import { MembershipType, BillingCycle, Currency } from "../../../generated/prisma/client.js"

export class PackageController {
  /**
   * Controller for resolving packages listing
   */
  static async getPackagesList() {
    return PackageService.getPackages()
  }

  /**
   * Controller for creating a package
   */
  static async createPackage(input: {
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
    return PackageService.createPackage(input)
  }

  /**
   * Controller for updating a package
   */
  static async updatePackage(
    id: string,
    input: {
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
    return PackageService.updatePackage(id, input)
  }

  /**
   * Controller for deleting a package
   */
  static async deletePackage(id: string) {
    return PackageService.deletePackage(id)
  }
}
