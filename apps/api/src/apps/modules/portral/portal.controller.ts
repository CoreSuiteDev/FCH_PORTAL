import { PortalService } from "./portal.service.js";

export class PortalController {
  /**
   * Controller for resolving portal status
   */
  static async getPortalStatus() {
    return PortalService.getInfo();
  }
}
