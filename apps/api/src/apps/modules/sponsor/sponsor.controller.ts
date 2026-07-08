import { SponsorShipService } from "./sponsor.service"

export class SponsorshipController {
  static async createSponsorship(
    body: Parameters<typeof SponsorShipService.createStripeSponsorship>[0]
  ) {
    return SponsorShipService.createStripeSponsorship(body)
  }

  static async getSponsorshipHistory(params: { page: number; limit: number }) {
    return SponsorShipService.getSponsorshipHistory(params)
  }

  static async deleteSponsorship(id: string) {
    return SponsorShipService.deleteSponsorship(id)
  }
}
