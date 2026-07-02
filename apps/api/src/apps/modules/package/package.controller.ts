import { PackageService } from "./package.service.js"
import { ZTCCreatePackage, ZTCUpdatePackage } from "@workspace/types"

export class PackageController {
  static async getPackagesList() {
    return PackageService.getPackages()
  }


  static async getPackageBySlug(slug: string) {
    return PackageService.getPackageBySlug(slug)
  }

  static async createPackage(input: ZTCCreatePackage) {
    return PackageService.createPackage(input)
  }

  /**
   * Controller for updating a package
   */
  static async updatePackage(id: string, input: ZTCUpdatePackage) {
    return PackageService.updatePackage(id, input)
  }

  /**
   * Controller for deleting a package
   */
  static async deletePackage(id: string) {
    return PackageService.deletePackage(id)
  }
}

