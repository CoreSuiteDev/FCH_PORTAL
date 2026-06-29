import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../../../server/trpc.js";
import { PaymentController, DonationController } from "./payment.controller.js";
import {
  PaginationInputSchema,
  ZCIPaginatedPaymentsSchema,
  ZCDonationInputSchema,
  ZCDonationResponseSchema,
} from "@workspace/types";
import { getPaginationMeta } from "../../../utils/pagination.js";

export const paymentRouter = router({
  /**
   * GET /payment/history — paginated donation history (admin only)
   */
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

  /**
   * POST /payment/donate — create a Stripe PaymentIntent for a donation.
   * Public: both guests and logged-in users can donate.
   * Returns a clientSecret for the frontend to confirm payment with Stripe.js.
   */
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
});
