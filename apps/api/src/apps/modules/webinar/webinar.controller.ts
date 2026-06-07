import { WebinarService } from "./webinar.service.js";

export class WebinarController {
  /**
   * Controller for resolving webinars listing
   */
  static async getWebinarsList() {
    return WebinarService.getWebinars();
  }
}
