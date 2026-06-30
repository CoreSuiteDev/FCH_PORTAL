import { z } from "zod"
import { CurrencyEnum } from "./membership"
import { PaginationMetaSchema } from "./pagination"

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

export const ZCDonationInputSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: CurrencyEnum,
  description: z.string().min(1, "Description is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  userId: z.string().optional(),
  paymentMethodId: z.string().min(1, "Payment method ID is required"),
})
export type ZTDonationInput = z.infer<typeof ZCDonationInputSchema>

/**
 * Response returned after creating a donation PaymentIntent.
 * The frontend uses `clientSecret` with Stripe.js to confirm the payment.
 */
export const ZCDonationResponseSchema = z.object({
  clientSecret: z.string(),
  donationId: z.string(),
})
export type ZTDonationResponse = z.infer<typeof ZCDonationResponseSchema>

// --- DONATION HISTORY ---

const ZCDonatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const ZCDonationUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().nullable(),
  email: z.string(),
  role: z.string(),
  createdAt: z.coerce.date(),
})

export const ZCDonationHistoryItemSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: CurrencyEnum,
  status: z.string(),
  paymentMethod: z.string().nullable(),
  cardBrand: z.string().nullable(),
  cardLast4: z.string().nullable(),
  receiptUrl: z.string().nullable(),
  stripeCustomerId: z.string().nullable(),
  donator: ZCDonatorSchema.nullable(),
  user: ZCDonationUserSchema.nullable(),
  createdAt: z.coerce.date(),
})
export type ZTDonationHistoryItem = z.infer<typeof ZCDonationHistoryItemSchema>

export const ZCPaginatedDonationHistorySchema = z.object({
  data: z.array(ZCDonationHistoryItemSchema),
  meta: PaginationMetaSchema,
})
export type ZTPaginatedDonationHistory = z.infer<typeof ZCPaginatedDonationHistorySchema>