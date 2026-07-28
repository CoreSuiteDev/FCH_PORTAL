import { z } from "zod"

export const ZCSponsorPlanSchema = z.object({
  name: z.string().min(1, "Plan Name is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["USD", "EUR"]),
  tier: z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]),
  benefits: z.array(z.string()).optional(),
  sortOrder: z.number().int().nonnegative().optional().default(0),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
})
export type ZTCSponsorPlan = z.infer<typeof ZCSponsorPlanSchema>

export const ZCSponsorPlanResponseSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  amount: z.coerce.number(),
  currency: z.enum(["USD", "EUR"]),
  tier: z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]),
  description: z.string().nullable().optional(),
  benefits: z.any().nullable().optional(),
  sortOrder: z.number(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
})
export type ZTCSponsorPlanResponse = z.infer<typeof ZCSponsorPlanResponseSchema>

export const ZCSponsorPlanIdSchema = z.object({
  id: z.string(),
})

export const ZCSponsorPlanUpdateInputSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Plan Name is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["USD", "EUR"]),
  tier: z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]),
  benefits: z.array(z.string()).optional(),
  sortOrder: z.number().int().nonnegative().optional().default(0),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
})
export type ZTCSponsorPlanUpdateInput = z.infer<typeof ZCSponsorPlanUpdateInputSchema>