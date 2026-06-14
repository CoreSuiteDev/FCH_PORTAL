import { z } from "zod"
import { PaymentStatusEnum } from "./auth.js"
import { PaginationMetaSchema } from "./pagination.js"

// Re-export for convenience so consumers can import PaymentStatus from this domain too
export { PaymentStatusEnum }

// --- PAGINATED PAYMENTS ---

export const ZCIPaginatedPaymentsSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      amount: z.number(),
      status: z.string(),
      date: z.coerce.date(),
    })
  ),
  meta: PaginationMetaSchema,
})
export type ZTPaginatedPayments = z.infer<typeof ZCIPaginatedPaymentsSchema>
