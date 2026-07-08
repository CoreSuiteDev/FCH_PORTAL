import z from "zod"
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../../../server/trpc.js"
import { MembershipController } from "./membership.controller.js"

export const membershipRouter = router({
  buyPackage: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/payment/buy-package",
        tags: ["payment"],
        summary: "Buy a membership package",
        description:
          "Charges the card, provisions a subscription and updates the user role",
      },
    })
    .input(
      z.object({
        packageId: z.string().cuid(),
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().optional(),
        userId: z.string(),
        paymentMethodId: z.string().optional(),
      })
    )
    .output(
      z.object({
        clientSecret: z.string().optional(),
        checkoutUrl: z.string().optional(),
        subscriptionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return MembershipController.createMembershipSubscription(input)
    }),

  memberships: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/memberships",
        tags: ["payment"],
        summary: "Get all user membership subscriptions",
        description:
          "Returns a paginated list of membership subscriptions with user and package details",
      },
    })
    .input(
      z
        .object({
          page: z.number().int().positive().default(1),
          limit: z.number().int().positive().default(10),
          search: z.string().optional(),
          tier: z.string().optional(),
          status: z.string().optional(),
        })
        .optional()
    )
    .output(z.any())
    .query(async ({ input }) => {
      return MembershipController.getMembershipsHistory({
        page: input?.page ?? 1,
        limit: input?.limit ?? 10,
        search: input?.search,
        tier: input?.tier,
        status: input?.status,
      })
    }),

  updateMembershipStatus: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/payment/memberships/{id}/status",
        tags: ["payment"],
        summary: "Update membership subscription status",
        description: "Updates the status of a membership subscription",
      },
    })
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          "Active",
          "Pending",
          "Expired",
          "Canceled",
          "Suspended",
        ]),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      return MembershipController.updateMembershipStatus(input.id, input.status)
    }),

  deleteMembership: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/payment/memberships/{id}",
        tags: ["payment"],
        summary: "Delete membership subscription record",
        description: "Deletes a membership subscription record",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .mutation(async ({ input }) => {
      return MembershipController.deleteMembershipSubscription(input.id)
    }),

  myMemberships: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/my-memberships",
        tags: ["payment"],
        summary: "Get user memberships",
        description:
          "Returns the authenticated user's own membership subscriptions",
      },
    })
    .input(z.object({ userId: z.string() }))
    .output(z.any())
    .query(async ({ input }) => {
      return MembershipController.getUserMemberships(input.userId)
    }),

  // ── Cancellation Request routes ───────────────────────────────────────────

  requestCancellation: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/payment/cancel-request",
        tags: ["payment"],
        summary: "Request membership cancellation",
        description:
          "User submits a cancellation request for their active subscription",
      },
    })
    .input(
      z.object({
        userId: z.string(),
        subscriptionId: z.string(),
        reason: z
          .string()
          .min(
            10,
            "Please provide at least 10 characters explaining the reason"
          ),
      })
    )
    .output(z.object({ id: z.string(), estimatedRefund: z.number() }))
    .mutation(async ({ input }) => {
      return MembershipController.requestCancellation(input)
    }),

  myRequests: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/my-cancel-requests",
        tags: ["payment"],
        summary: "Get user's cancellation requests",
        description:
          "Returns the authenticated user's own cancellation requests",
      },
    })
    .input(z.object({ userId: z.string() }))
    .output(z.any())
    .query(async ({ input }) => {
      return MembershipController.getUserCancellationRequests(input.userId)
    }),

  cancellationRequests: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/cancel-requests",
        tags: ["payment"],
        summary: "Get all cancellation requests",
        description: "Admin: paginated list of all cancellation requests",
      },
    })
    .input(
      z
        .object({
          page: z.number().int().positive().default(1),
          limit: z.number().int().positive().default(10),
          search: z.string().optional(),
          tier: z.string().optional(),
          status: z.string().optional(),
        })
        .optional()
    )
    .output(z.any())
    .query(async ({ input }) => {
      return MembershipController.getCancellationRequests({
        page: input?.page ?? 1,
        limit: input?.limit ?? 10,
        search: input?.search,
        tier: input?.tier,
        status: input?.status,
      })
    }),

  processCancellation: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/payment/cancel-requests/{requestId}/process",
        tags: ["payment"],
        summary: "Process a cancellation request",
        description:
          "Super admin: approve (with optional Stripe refund) or reject a cancellation request",
      },
    })
    .input(
      z.object({
        requestId: z.string(),
        action: z.enum(["APPROVE", "REJECT"]),
        refundAmount: z.number().min(0).optional(),
        adminNote: z.string().optional(),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      return MembershipController.processCancellation(input)
    }),
})
