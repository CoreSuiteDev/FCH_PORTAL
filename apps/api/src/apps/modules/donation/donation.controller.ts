import { DonationService } from "./donation.service";


export class DonationController {
  static async createDonation(body: Parameters<typeof DonationService.createStripeDonation>[0]) {
    return DonationService.createStripeDonation(body);
  }

  static async getDonationHistory(params: {page: number, limit: number}){
    return DonationService.getDonationHistory(params);
  }

  static async getDonationById(id: string) {
    return DonationService.getDonationById(id);
  }

  static async deleteDonation(id: string) {
    return DonationService.deleteDonation(id);
  }

}