import { z } from "zod";
import {
  ZCSponsorPlanSchema,
  ZCSponsorPlanResponseSchema,
  ZCSponsorPlanIdSchema,
  ZCSponsorPlanUpdateInputSchema,
} from "@workspace/types/index.js";
import { router, publicProcedure, adminProcedure } from "../../../server/trpc.js";
import { SponsorPlanController } from "./sponsor-plan.controller.js";

export const sponsorPlanRouter = router({
  createSponsorPlan: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/sponsor-plan/create",
        tags: ["sponsor-plan"],
        summary: "Create a sponsor plan",
        description: "Creates a new sponsor plan",
      },
    })
    .input(ZCSponsorPlanSchema)
    .output(ZCSponsorPlanResponseSchema)
    .mutation(async ({ input }) => {
      return SponsorPlanController.createSponsorPlan(input);
    }),

  getAllSponsorPlan: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/sponsor-plan/get",
        tags: ["sponsor-plan"],
        summary: "Get all sponsor plans",
        description: "Returns a list of all sponsor plans",
      },
    })
    .output(z.array(ZCSponsorPlanResponseSchema))
    .query(async () => {
      return SponsorPlanController.getAllSponsorPlan();
    }),

  getSponsorPlanById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/sponsor-plan/:id",
        tags: ["sponsor-plan"],
        summary: "Get a sponsor plan by ID",
        description: "Returns a sponsor plan by ID",
      },
    })
    .input(ZCSponsorPlanIdSchema)
    .output(ZCSponsorPlanResponseSchema.nullable())
    .query(async ({ input }) => {
      return SponsorPlanController.getSponsorPlanById(input.id);
    }),

  updateSponsorPlan: adminProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/sponsor-plan/:id",
        tags: ["sponsor-plan"],
        summary: "Update a sponsor plan",
        description: "Updates a sponsor plan",
      },
    })
    .input(ZCSponsorPlanUpdateInputSchema)
    .output(ZCSponsorPlanResponseSchema)
    .mutation(async ({ input }) => {
      const { id, ...body } = input;
      return SponsorPlanController.updateSponsorPlan(id, body);
    }),

  deleteSponsorPlan: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/sponsor-plan/:id",
        tags: ["sponsor-plan"],
        summary: "Delete a sponsor plan",
        description: "Deletes a sponsor plan",
      },
    })
    .input(ZCSponsorPlanIdSchema)
    .output(ZCSponsorPlanResponseSchema)
    .mutation(async ({ input }) => {
      return SponsorPlanController.deleteSponsorPlan(input.id);
    }),
});