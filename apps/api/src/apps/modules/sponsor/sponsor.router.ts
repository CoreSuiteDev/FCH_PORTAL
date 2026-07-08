import {
  PaginationInputSchema,
  ZCPaginatedSponsorshipHistorySchema,
  ZCSponsorShipInputSchema,
  ZCSponsorShipResponseSchema,
} from "@workspace/types/index"
import z from "zod"
import { adminProcedure, publicProcedure, router } from "../../../server/trpc"
import { getPaginationMeta } from "../../../utils/pagination"
import { SponsorshipController } from "./sponsor.controller"

export const sponsorRouter = router({
  sponsorship: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/payment/sponsorship",
        tags: ["payment"],
        summary: "Create a sponsorship",
        description:
          "Creates a Stripe PaymentIntent and returns a clientSecret for frontend confirmation",
      },
    })
    .input(ZCSponsorShipInputSchema)
    .output(ZCSponsorShipResponseSchema)
    .mutation(async ({ input }) => {
      return SponsorshipController.createSponsorship(input)
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
      const page = input?.page ?? 1
      const limit = input?.limit ?? 10
      const { totalCount, data } =
        await SponsorshipController.getSponsorshipHistory({ page, limit })
      return {
        data: data.map((d: any) => {
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
          }
        }),
        meta: getPaginationMeta(totalCount, page, limit),
      }
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
      return SponsorshipController.deleteSponsorship(input.id)
    }),
})
