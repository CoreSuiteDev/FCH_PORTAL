import {
  PaginationInputSchema,
  ZCDonationInputSchema,
  ZCDonationResponseSchema,
  ZCPaginatedDonationHistorySchema,
} from "@workspace/types/index"
import z from "zod"
import { adminProcedure, publicProcedure, router } from "../../../server/trpc"
import { getPaginationMeta } from "../../../utils/pagination"
import { DonationController } from "./donation.controller"

export const donationRouter = router({
  donate: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/payment/donate",
        tags: ["payment"],
        summary: "Create a donation",
        description:
          "Creates a Stripe PaymentIntent and returns a clientSecret for frontend confirmation",
      },
    })
    .input(ZCDonationInputSchema)
    .output(ZCDonationResponseSchema)
    .mutation(async ({ input }) => {
      return DonationController.createDonation(input)
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
      const page = input?.page ?? 1
      const limit = input?.limit ?? 10
      const { totalCount, data } = await DonationController.getDonationHistory({
        page,
        limit,
      })
      return {
        data: data.map((d) => {
          let topRole = "USER"
          if (d.user) {
            const roles = d.user.userRoles.map((ur: any) => ur.role.name)
            if (roles.includes("SUPER_ADMIN")) {
              topRole = "SUPER_ADMIN"
            } else if (roles.includes("BOARD")) {
              topRole = "BOARD"
            } else if (roles.includes("PASTORAL")) {
              topRole = "PASTORAL"
            } else if (roles.includes("MEMBER")) {
              topRole = "MEMBER"
            } else if (roles[0]) {
              topRole = roles[0]
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
          }
        }),
        meta: getPaginationMeta(totalCount, page, limit),
      }
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
      return DonationController.deleteDonation(input.id)
    }),

  filterDonations: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/donation/filter",
        tags: ["payment"],
        summary: "Filter donation history",
        description: "Returns a paginated, filtered list of user donation histories",
      },
    })
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
        skip: z.number().int().optional(),
        status: z.string().optional().default("ALL"),
        search: z.string().optional().default(""),
        minAmount: z.number().optional(),
        maxAmount: z.number().optional(),
        createdAt: z.string().optional().default(""),
        role: z.string().optional().default("ALL"),
      })
    )
    .output(ZCPaginatedDonationHistorySchema)
    .query(async ({ input }) => {
      const page = input.page
      const limit = input.limit
      const skip = input.skip ?? (page - 1) * limit
      const { totalCount, data } = await DonationController.filterDonations({
        page,
        limit,
        skip,
        status: input.status,
        search: input.search,
        minAmount: input.minAmount as any,
        maxAmount: input.maxAmount as any,
        createdAt: input.createdAt,
        role: input.role,
      })
      return {
        data: data.map((d) => {
          let topRole = "USER"
          if (d.user) {
            const roles = d.user.userRoles.map((ur: any) => ur.role.name)
            if (roles.includes("SUPER_ADMIN")) {
              topRole = "SUPER_ADMIN"
            } else if (roles.includes("BOARD")) {
              topRole = "BOARD"
            } else if (roles.includes("PASTORAL")) {
              topRole = "PASTORAL"
            } else if (roles.includes("MEMBER")) {
              topRole = "MEMBER"
            } else if (roles[0]) {
              topRole = roles[0]
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
          }
        }),
        meta: getPaginationMeta(totalCount, page, limit),
      }
    }),

  getDonationStats: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/donation/stats",
        tags: ["payment"],
        summary: "Get donation statistics",
        description: "Returns role-based and overall donation revenue statistics",
      },
    })
    .output(z.any())
    .query(async () => {
      return DonationController.getDonationStats()
    }),
})
