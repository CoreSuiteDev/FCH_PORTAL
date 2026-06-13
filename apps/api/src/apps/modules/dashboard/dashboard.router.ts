import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../../../server/trpc.js";
import { DashboardController } from "./dashboard.controller.js";

export const dashboardRouter = router({
  metrics: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/dashboard/metrics",
        tags: ["dashboard"],
        summary: "Get dashboard overview metrics",
        description: "Returns statistics summary for users, revenues, and rates"
      },
    })
    .input(z.void())
    .output(z.object({
      activeMembers: z.number(),
      pendingMembers: z.number(),
      monthlyRevenue: z.number(),
      renewalsRate: z.number(),
    }))
    .query(async () => {
      return DashboardController.getOverviewMetrics();
    }),
});
