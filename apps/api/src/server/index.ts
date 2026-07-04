import { z } from "zod";
import { router, publicProcedure } from "./trpc.js";
import { userRouter } from "../apps/modules/user/user.router.js";
import { authRouter } from "../apps/modules/auth/auth.router.js";
import { dashboardRouter } from "../apps/modules/dashboard/dashboard.router.js";
import { eventsRouter } from "../apps/modules/events/events.router.js";
import { paymentRouter } from "../apps/modules/payment/payment.router.js";
import { portalRouter } from "../apps/modules/portral/portal.router.js";
import { resourcesRouter } from "../apps/modules/resources/resources.router.js";
import { packageRouter } from "../apps/modules/package/package.router.js";
import { inqueryRouter } from "../apps/modules/inquery/inquery.router.js";
import { sponsorPlanRouter } from "../apps/modules/sponsor-plan/sponsor-plan.router.js";
import { newsRouter } from "../apps/modules/news/news.router.js";
import { authorRouter } from "../apps/modules/author/author.router.js";

// Root Router
export const appRouter = router({
  hello: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/hello",
        tags: ["general"],
        summary: "Say hello",
        description: "Returns a greeting message"
      },
    })
    .input(z.object({ name: z.string().optional() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello, ${input.name || "World"}!`,
      };
    }),

  user: userRouter,
  auth: authRouter,
  dashboard: dashboardRouter,
  events: eventsRouter,
  payment: paymentRouter,
  portal: portalRouter,
  resources: resourcesRouter,
  package: packageRouter,
  inquery: inqueryRouter,
  sponsorPlan: sponsorPlanRouter,
  news: newsRouter,
  author: authorRouter,
});

export type AppRouter = typeof appRouter;
