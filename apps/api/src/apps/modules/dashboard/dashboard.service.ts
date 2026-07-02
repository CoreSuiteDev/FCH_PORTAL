import { prisma } from "../../../infrastructure/database/prisma.js"

export class DashboardService {
  /**
   * Fetch system metrics for the admin/member dashboards
   */
  static async getMetrics() {
    // Count users who are active
    const activeMembers = await prisma.user.count({
      where: {
        status: "ACTIVE",
      },
    })

    // Count pending memberships
    const pendingMembers = await prisma.subscription.count({
      where: {
        status: "PENDING",
      },
    })

    // Sum PAID payments in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const revenueAggregate = await prisma.payment.aggregate({
      where: {
        status: "SUCCEEDED",
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const monthlyRevenue = revenueAggregate._sum?.amount ? Number(revenueAggregate._sum.amount) : 0

    // Calculate renewals rate as percentage of active memberships out of active + expired
    const activeMemberships = await prisma.subscription.count({
      where: {
        status: "ACTIVE",
      },
    })

    const expiredMemberships = await prisma.subscription.count({
      where: {
        status: "EXPIRED",
      },
    })

    const totalMembershipsForRenewal = activeMemberships + expiredMemberships
    const renewalsRate = totalMembershipsForRenewal > 0
      ? Math.round((activeMemberships / totalMembershipsForRenewal) * 100)
      : 100

    return {
      activeMembers,
      pendingMembers,
      monthlyRevenue,
      renewalsRate,
    }
  }
}

