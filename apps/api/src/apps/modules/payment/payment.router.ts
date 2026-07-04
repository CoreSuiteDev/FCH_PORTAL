
import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../../../server/trpc.js";
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
});
