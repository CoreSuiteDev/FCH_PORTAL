
import { z } from "zod";
import { router, publicProcedure, adminProcedure, protectedProcedure } from "../../../server/trpc.js";
import { PaymentController, DonationController, SponsorshipController } from "./payment.controller.js";
import {
  PaginationInputSchema,
  ZCIPaginatedPaymentsSchema,
  ZCDonationInputSchema,
  ZCDonationResponseSchema,
  ZCPaginatedDonationHistorySchema,
  ZCSponsorShipInputSchema,
  ZCSponsorShipResponseSchema,
  ZCPaginatedSponsorshipHistorySchema,
} from "@workspace/types";
import { getPaginationMeta } from "../../../utils/pagination.js";

export const paymentRouter = router({
 
  history: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/history",
        tags: ["payment"],
        summary: "Get payment transaction history",
        description: "Returns a paginated list of user payment histories",
      },
    })
    .input(PaginationInputSchema.optional())
    .output(ZCIPaginatedPaymentsSchema)
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const { totalCount, data } = await PaymentController.getPaymentHistory({ page, limit });
      return {
        data,
        meta: getPaginationMeta(totalCount, page, limit),
      };
    }),

// Donation Routers
  donate: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/payment/donate",
        tags: ["payment"],
        summary: "Create a donation",
        description: "Creates a Stripe PaymentIntent and returns a clientSecret for frontend confirmation",
      },
    })
    .input(ZCDonationInputSchema)
    .output(ZCDonationResponseSchema)
    .mutation(async ({ input }) => {
      return DonationController.createDonation(input);
    }),

  donationHistory: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/donation-history",
        tags: ["payment"],
        summary: "Get donation history",
        description: "Returns a paginated list of user donation histories",
      },
    })
    .input(PaginationInputSchema.optional())
    .output(ZCPaginatedDonationHistorySchema)
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const { totalCount, data } = await DonationController.getDonationHistory({ page, limit });
      return {
        data: data.map((d) => {
          let topRole = "USER";
          if (d.user) {
            const roles = d.user.userRoles.map((ur: any) => ur.role.name);
            if (roles.includes("SUPER_ADMIN")) {
              topRole = "SUPER_ADMIN";
            } else if (roles.includes("BOARD")) {
              topRole = "BOARD";
            } else if (roles.includes("PASTORAL")) {
              topRole = "PASTORAL";
            } else if (roles.includes("MEMBER")) {
              topRole = "MEMBER";
            } else if (roles[0]) {
              topRole = roles[0];
            }
          }
          return {
            id: d.id,
            amount: Number(d.amount),
            status: d.status,
            currency: d.currency,
            donator: d.donator,
            user: d.user
              ? {
                  id: d.user.id,
                  name: d.user.name,
                  email: d.user.email,
                  phone: d.user.phone ?? null,
                  role: topRole,
                  createdAt: d.user.createdAt,
                }
              : null,
            receiptUrl: d.receiptUrl,
            paymentMethod: d.paymentMethod,
            cardBrand: d.cardBrand,
            cardLast4: d.cardLast4,
            stripeCustomerId: d.donator?.stripeCustomerId || null,
            createdAt: d.createdAt,
          };
        }),
        meta: getPaginationMeta(totalCount, page, limit),
      };
    }),


    // Sponsorship Routers

    sponsorship: publicProcedure
      .meta({
        openapi: {
          method: "POST",
          path: "/payment/sponsorship",
          tags: ["payment"],
          summary: "Create a sponsorship",
          description: "Creates a Stripe PaymentIntent and returns a clientSecret for frontend confirmation",
        }
      })
      .input(ZCSponsorShipInputSchema)
      .output(ZCSponsorShipResponseSchema)
      .mutation(async ({ input }) => {
        return SponsorshipController.createSponsorship(input);
      }),

    sponsorshipHistory: adminProcedure
        .meta({
          openapi: {
            method: "GET",
            path: "/payment/sponsorship-history",
            tags: ["payment"],
            summary: "Get sponsorship history",
            description: "Returns a paginated list of user sponsorship histories",
          },
        })
        .input(PaginationInputSchema.optional())
        .output(ZCPaginatedSponsorshipHistorySchema)
        .query(async ({ input }) => {
          const page = input?.page ?? 1;
          const limit = input?.limit ?? 10;
          const { totalCount, data } = await SponsorshipController.getSponsorshipHistory({ page, limit });
          return {
            data: data.map((d: any) => {
              let topRole = "USER";
              if (d.user) {
                const roles = d.user.userRoles.map((ur: any) => ur.role.name);
                if (roles.includes("SUPER_ADMIN")) {
                  topRole = "SUPER_ADMIN";
                } else if (roles.includes("BOARD")) {
                  topRole = "BOARD";
                } else if (roles.includes("PASTORAL")) {
                  topRole = "PASTORAL";
                } else if (roles.includes("MEMBER")) {
                  topRole = "MEMBER";
                } else if (roles[0]) {
                  topRole = roles[0];
                }
              }
              return {
                id: d.id,
                amount: Number(d.amount),
                status: d.status,
                currency: d.currency,
                sponsor: d.sponsor,
                tier: d.plan?.tier || "BRONZE",
                user: d.user
                  ? {
                      id: d.user.id,
                      name: d.user.name,
                      email: d.user.email,
                      phone: d.user.phone ?? null,
                      role: topRole,
                      createdAt: d.user.createdAt,
                    }
                  : null,
                receiptUrl: d.receiptUrl,
                paymentMethod: d.paymentMethod,
                cardBrand: d.cardBrand,
                cardLast4: d.cardLast4,
                stripeCustomerId: d.stripeCustomerId,
                createdAt: d.createdAt,
              };
            }),
            meta: getPaginationMeta(totalCount, page, limit),
          };
        }),

  deleteDonation: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/payment/donation/{id}",
        tags: ["payment"],
        summary: "Delete a donation",
        description: "Deletes a donation history record by ID",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .mutation(async ({ input }) => {
      return DonationController.deleteDonation(input.id);
    }),

  deleteSponsorship: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/payment/sponsorship/{id}",
        tags: ["payment"],
        summary: "Delete a sponsorship",
        description: "Deletes a sponsorship history record by ID",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .mutation(async ({ input }) => {
      return SponsorshipController.deleteSponsorship(input.id);
    }),

  buyPackage: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/payment/buy-package",
        tags: ["payment"],
        summary: "Buy a membership package",
        description: "Charges the card, provisions a subscription and updates the user role",
      },
    })
    .input(
      z.object({
        packageId: z.string().cuid(),
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().optional(),
        userId: z.string(),
        paymentMethodId: z.string().min(1, "Payment method ID is required"),
      })
    )
    .output(
      z.object({
        clientSecret: z.string(),
        subscriptionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { MembershipService } = await import("./payment.service.js")
      return MembershipService.createMembershipSubscription(input)
    }),

  memberships: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/memberships",
        tags: ["payment"],
        summary: "Get all user membership subscriptions",
        description: "Returns a paginated list of membership subscriptions with user and package details",
      },
    })
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
        search: z.string().optional(),
        tier: z.string().optional(),
        status: z.string().optional(),
      }).optional()
    )
    .output(z.any())
    .query(async ({ input }) => {
      const { MembershipService } = await import("./payment.service.js")
      return MembershipService.getMembershipsHistory({
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
        status: z.enum(["Active", "Pending", "Expired", "Canceled", "Suspended"]),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const { MembershipService } = await import("./payment.service.js")
      return MembershipService.updateMembershipStatus(input.id, input.status)
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
      const { MembershipService } = await import("./payment.service.js")
      return MembershipService.deleteMembershipSubscription(input.id)
    }),

  myMemberships: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/my-memberships",
        tags: ["payment"],
        summary: "Get user memberships",
        description: "Returns the authenticated user's own membership subscriptions",
      },
    })
    .input(z.object({ userId: z.string() }))
    .output(z.any())
    .query(async ({ input }) => {
      const { MembershipService } = await import("./payment.service.js")
      return MembershipService.getUserMemberships(input.userId)
    }),

  // ── Cancellation Request routes ───────────────────────────────────────────

  requestCancellation: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/payment/cancel-request",
        tags: ["payment"],
        summary: "Request membership cancellation",
        description: "User submits a cancellation request for their active subscription",
      },
    })
    .input(
      z.object({
        userId: z.string(),
        subscriptionId: z.string(),
        reason: z.string().min(10, "Please provide at least 10 characters explaining the reason"),
      })
    )
    .output(z.object({ id: z.string(), estimatedRefund: z.number() }))
    .mutation(async ({ input }) => {
      const { MembershipService } = await import("./payment.service.js")
      return MembershipService.requestCancellation(input)
    }),

  myRequests: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/my-cancel-requests",
        tags: ["payment"],
        summary: "Get user's cancellation requests",
        description: "Returns the authenticated user's own cancellation requests",
      },
    })
    .input(z.object({ userId: z.string() }))
    .output(z.any())
    .query(async ({ input }) => {
      const { MembershipService } = await import("./payment.service.js")
      return MembershipService.getUserCancellationRequests(input.userId)
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
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
        search: z.string().optional(),
        tier: z.string().optional(),
        status: z.string().optional(),
      }).optional()
    )
    .output(z.any())
    .query(async ({ input }) => {
      const { MembershipService } = await import("./payment.service.js")
      return MembershipService.getCancellationRequests({
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
        description: "Super admin: approve (with optional Stripe refund) or reject a cancellation request",
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
      const { MembershipService } = await import("./payment.service.js")
      return MembershipService.processCancellation(input)
    }),
});

