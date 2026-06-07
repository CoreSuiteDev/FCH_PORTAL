export class PortalService {
  /**
   * Fetch portal state details
   */
  static async getInfo() {
    return { systemStatus: "all-systems-operational", version: "1.0.0" };
  }
}
