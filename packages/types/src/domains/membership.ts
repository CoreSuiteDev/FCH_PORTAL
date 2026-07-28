import { z } from "zod"
import { MembershipTypeEnum } from "./auth"

export const BillingCycleEnum = z.enum(["MONTHLY", "YEARLY"])
export type BillingCycle = z.infer<typeof BillingCycleEnum>

export const CurrencyEnum = z.enum(["USD", "EUR"])
export type Currency = z.infer<typeof CurrencyEnum>

export const SubscriptionStatusEnum = z.enum([
  "PENDING",
  "ACTIVE",
  "TRIALING",
  "PAST_DUE",
  "UNPAID",
  "CANCELED",
  "EXPIRED",
])
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusEnum>

const NameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name cannot exceed 100 characters")

const SlugSchema = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters")
  .max(100, "Slug cannot exceed 100 characters")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug can only contain lowercase letters, numbers and hyphens"
  )

const PriceSchema = z.coerce
  .number()
  .finite()
  .nonnegative("Price must be non-negative")
  .multipleOf(0.01, "Price can have at most 2 decimal places")

const SubtitleSchema = z
  .string()
  .trim()
  .max(150, "Subtitle cannot exceed 150 characters")

const DescriptionSchema = z
  .string()
  .trim()
  .max(5000, "Description cannot exceed 5000 characters")

const FeatureTitleSchema = z
  .string()
  .trim()
  .max(100, "Feature title cannot exceed 100 characters")

const FeaturesSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Feature cannot be empty")
      .max(200, "Feature cannot exceed 200 characters")
  )
  .max(100, "Maximum 100 features allowed")

const SortOrderSchema = z.number().int().min(0, "Sort order cannot be negative")

export const ZCIMembershipPackageSchema = z.object({
  id: z.string().cuid(),

  name: NameSchema,
  slug: SlugSchema,

  type: MembershipTypeEnum,
  billingCycle: BillingCycleEnum,

  price: PriceSchema,
  currency: CurrencyEnum,

  subTitle: SubtitleSchema.optional(),
  description: DescriptionSchema.optional(),

  featureTitle: FeatureTitleSchema.optional(),
  features: FeaturesSchema.optional(),

  isPopular: z.boolean(),
  sortOrder: SortOrderSchema,

  isActive: z.boolean(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ZTCMembershipPackage = z.infer<typeof ZCIMembershipPackageSchema>

export const ZCICreatePackageSchema = z.object({
  name: NameSchema,
  slug: SlugSchema,

  type: MembershipTypeEnum,
  billingCycle: BillingCycleEnum,

  price: PriceSchema,
  currency: CurrencyEnum.default("USD"),

  subTitle: SubtitleSchema.optional(),
  description: DescriptionSchema.optional(),

  featureTitle: FeatureTitleSchema.optional(),
  features: FeaturesSchema.optional(),

  isPopular: z.boolean().default(false),
  sortOrder: SortOrderSchema.default(0),

  isActive: z.boolean().default(true),
})

export type ZTCCreatePackage = z.infer<typeof ZCICreatePackageSchema>

export const ZCIUpdatePackageSchema = z.object({
  name: NameSchema.optional(),
  slug: SlugSchema.optional(),

  type: MembershipTypeEnum.optional(),
  billingCycle: BillingCycleEnum.optional(),

  price: PriceSchema.optional(),
  currency: CurrencyEnum.optional(),

  subTitle: SubtitleSchema.optional(),
  description: DescriptionSchema.optional(),

  featureTitle: FeatureTitleSchema.optional(),
  features: FeaturesSchema.optional(),

  isPopular: z.boolean().optional(),
  sortOrder: SortOrderSchema.optional(),

  isActive: z.boolean().optional(),
})

export type ZTCUpdatePackage = z.infer<typeof ZCIUpdatePackageSchema>


export const ZCPackageFormSchema = z.object({
  name: z.string().min(2, "Package Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  type: z.enum(["GENERAL", "PASTORAL"]),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  price: z.number().nonnegative("Price must be non-negative"),
  currency: z.enum(["USD", "EUR"]),
  subTitle: z.string().optional(),
  description: z.string().optional(),
  featureTitle: z.string().optional(),
  features: z.array(z.string()),
  sortOrder: z.number().int().nonnegative("Sort order must be non-negative"),
  isActive: z.boolean(),
  isPopular: z.boolean(),
})

export type ZTPackageFormValues = z.infer<typeof ZCPackageFormSchema>