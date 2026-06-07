import { z } from "zod";
import { router, publicProcedure } from "../../../server/trpc.js";
import { PaymentController } from "./payment.controller.js";

export const paymentRouter = router({
  history: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/payment/history",
        tags: ["payment"],
        summary: "Get payment transaction history",
        description: "Returns an array of user payment histories"
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.string(),
      amount: z.number(),
      status: z.string(),
      date: z.date()
    })))
    .query(async () => {
      return PaymentController.getPaymentHistory();
    })
});
