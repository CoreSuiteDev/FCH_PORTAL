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

  static async getDonationStats() {
    return DonationService.getDonationStats();
  }

  static async filterDonations(params: Parameters<typeof DonationService.filterDonations>[0]) {
    return DonationService.filterDonations(params);
  }

}