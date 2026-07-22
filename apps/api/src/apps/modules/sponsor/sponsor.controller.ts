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

  static async filterSponsorship(
    params: Parameters<typeof SponsorShipService.filterSponsorship>[0]
  ) {
    return SponsorShipService.filterSponsorship(params)
  }

  static async getSponsorStats() {
    return SponsorShipService.getSponsorStats()
  }

  static async cancelSponsorship(input: { sponsorshipId?: string; sessionId?: string }) {
    return SponsorShipService.cancelSponsorship(input)
  }
}
