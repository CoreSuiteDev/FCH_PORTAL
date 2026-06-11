import { z } from "zod";
import { router, publicProcedure } from "../../../server/trpc.js";
import { PaymentController } from "./payment.controller.js";
import { PaginationInputSchema, ZCIPaginatedPaymentsSchema } from "@workspace/types";
import { getPaginationMeta } from "../../../utils/pagination.js";

export const paymentRouter = router({
  history: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/history",
        tags: ["payment"],
        summary: "Get payment transaction history",
        description: "Returns a paginated list of user payment histories"
      }
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
    })
});
