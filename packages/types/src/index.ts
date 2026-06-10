import { z } from "zod";

// --- ENUMS ---
export const UserStatusEnum = z.enum(["ACTIVE", "RESTRICTED", "SUSPENDED", "BANNED"]);
export type UserStatus = z.infer<typeof UserStatusEnum>;

export const MembershipTypeEnum = z.enum(["GENERAL", "PASTORAL"]);
export type MembershipType = z.infer<typeof MembershipTypeEnum>;

export const MembershipStatusEnum = z.enum(["PENDING", "ACTIVE", "EXPIRED", "CANCELED", "FAILED"]);
export type MembershipStatus = z.infer<typeof MembershipStatusEnum>;

export const PaymentStatusEnum = z.enum(["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIAL_REFUNDED"]);
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

// --- MODELS ---

// User Profile / Member Schema
export const ZCIUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable().optional(),
  status: UserStatusEnum.default("ACTIVE"),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type ZTUser = z.infer<typeof ZCIUserSchema>;

// Session Schema
export const ZCISessionSchema = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  userId: z.string(),
});
export type ZTCSession = z.infer<typeof ZCISessionSchema>;

// Membership Schema
export const ZCICMembershipSchema = z.object({
  id: z.string(),
  type: MembershipTypeEnum,
  status: MembershipStatusEnum,
  startsAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
});
export type ZTCMembership = z.infer<typeof ZCICMembershipSchema>;

// Payment Schema
export const ZCICPaymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: PaymentStatusEnum,
  createdAt: z.coerce.date(),
});
export type ZTCCPayment = z.infer<typeof ZCICPaymentSchema>;

// Extended User Schema with all relationships (used in user profiles/list)
export const ZCIUserOutputSchema = ZCIUserSchema.extend({
  roles: z.array(z.string()),
  memberships: z.array(ZCICMembershipSchema),
  payments: z.array(ZCICPaymentSchema),
});
export type ZTCIUserOutput = z.infer<typeof ZCIUserOutputSchema>;

// --- AUTH API PAYLOADS ---

// Signup/Login Response Schema
export const ZCICAuthResponseSchema = z.object({
  token: z.string().optional(),
  redirect: z.boolean().optional(),
  user: ZCIUserSchema,
});
export type ZTCIAuthResponse = z.infer<typeof ZCICAuthResponseSchema>;

// GetSession/Me Response Schema
export const ZCICMeResponseSchema = z.object({
  session: ZCISessionSchema,
  user: ZCIUserSchema,
}).nullable();
export type ZTCMeResponse = z.infer<typeof ZCICMeResponseSchema>;

// --- MEMBERSHIP PACKAGE SCHEMAS ---

export const BillingCycleEnum = z.enum(["MONTHLY", "YEARLY"]);
export type BillingCycle = z.infer<typeof BillingCycleEnum>;

export const CurrencyEnum = z.enum(["USD", "EUR"]);
export type Currency = z.infer<typeof CurrencyEnum>;

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

