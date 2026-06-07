import { prisma } from "../../../lib/prisma.js";

export class DashboardService {
  /**
   * Fetch system metrics for the admin/member dashboards
   */
  static async getMetrics() {
    const totalUsers = await prisma.user.count();
    
    return {
      activeMembers: totalUsers,
      pendingMembers: 0,
      monthlyRevenue: 0,
      renewalsRate: 100,
    };
  }
}
