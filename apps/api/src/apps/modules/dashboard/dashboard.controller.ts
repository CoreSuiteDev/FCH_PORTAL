import { DashboardService } from "./dashboard.service.js";

export class DashboardController {
  /**
   * Controller for resolving dashboard overview metrics
   */
  static async getOverviewMetrics() {
    return DashboardService.getMetrics();
  }
}
