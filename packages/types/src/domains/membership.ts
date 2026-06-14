import { z } from "zod";
import { MembershipTypeEnum, MembershipStatusEnum } from "./auth.js";

// --- ENUMS ---
export const BillingCycleEnum = z.enum(["MONTHLY", "YEARLY"]);
export type BillingCycle = z.infer<typeof BillingCycleEnum>;

export const CurrencyEnum = z.enum(["USD", "EUR"]);
export type Currency = z.infer<typeof CurrencyEnum>;

// Re-export membership enums from auth (they live there due to UserOutput dependency)
export { MembershipTypeEnum, MembershipStatusEnum };

// --- MEMBERSHIP PACKAGE SCHEMAS ---

export const ZCIMembershipPackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: MembershipTypeEnum,
  billingCycle: BillingCycleEnum,
  price: z.number(),
  currency: CurrencyEnum.default("USD"),
  oktaGroup: z.string(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type ZTCMembershipPackage = z.infer<typeof ZCIMembershipPackageSchema>;

export const ZCICreatePackageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  type: MembershipTypeEnum,
  billingCycle: BillingCycleEnum,
  price: z.number().nonnegative("Price must be a non-negative number"),
  currency: CurrencyEnum.default("USD"),
  oktaGroup: z.string().min(1, "Okta Group is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true).optional(),
});
export type ZTCCreatePackage = z.infer<typeof ZCICreatePackageSchema>;

export const ZCIUpdatePackageSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  type: MembershipTypeEnum.optional(),
  billingCycle: BillingCycleEnum.optional(),
  price: z.number().nonnegative().optional(),
  currency: CurrencyEnum.optional(),
  oktaGroup: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
export type ZTCUpdatePackage = z.infer<typeof ZCIUpdatePackageSchema>;
