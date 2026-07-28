
import { z } from "zod";
import { router, publicProcedure, adminProcedure, protectedProcedure } from "../../../server/trpc.js";
import { PaymentController } from "./payment.controller.js";
import {
  PaginationInputSchema,
  ZCIPaginatedPaymentsSchema,
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

  sessionReceipt: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/session-receipt",
        tags: ["payment"],
        summary: "Get Stripe receipt URL by session_id",
        description: "Retrieves Stripe receipt_url for a completed checkout session",
      },
    })
    .input(z.object({ sessionId: z.string() }))
    .output(z.object({ receiptUrl: z.string().nullable(), transactionId: z.string().nullable() }))
    .query(async ({ input }) => {
      return PaymentController.getSessionReceipt(input.sessionId);
    }),
});

