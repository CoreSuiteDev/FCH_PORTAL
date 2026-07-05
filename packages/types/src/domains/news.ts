import { z } from "zod"

export const PublishStatusEnum = z.enum(["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"])
export type PublishStatus = z.infer<typeof PublishStatusEnum>

export const NewsTypeEnum = z.enum(["NEWS", "BLOG", "ANNOUNCEMENT"])
export type NewsType = z.infer<typeof NewsTypeEnum>

// --- AUTHOR SCHEMAS ---
export const ZCIAuthorSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase alphanumeric characters and hyphens"),
  bio: z.string().nullable().optional(),
  avatar: z.string().url("Avatar must be a valid URL").or(z.string().length(0)).nullable().optional(),
  designation: z.string().nullable().optional(),
})
export type ZTCAuthor = z.infer<typeof ZCIAuthorSchema>

export const ZCICreateAuthorSchema = ZCIAuthorSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export type ZTCCreateAuthor = z.infer<typeof ZCICreateAuthorSchema>

export const ZCIUpdateAuthorSchema = ZCICreateAuthorSchema.partial()
export type ZTCUpdateAuthor = z.infer<typeof ZCIUpdateAuthorSchema>

export const ZCIAuthorOutputSchema = ZCIAuthorSchema.extend({
  _count: z.object({ news: z.number() }).optional().nullable(),
})
export type ZTCAuthorOutput = z.infer<typeof ZCIAuthorOutputSchema>

// --- TAG SCHEMAS ---
export const ZCITagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1),
})
export type ZTCTag = z.infer<typeof ZCITagSchema>

// --- NEWS SCHEMAS ---
export const ZCINewsSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  supTitle: z.string().max(255).nullable().optional(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase alphanumeric characters and hyphens"),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  metaTitle: z.string().max(255).nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  metaKeywords: z.string().nullable().optional(),
  canonicalUrl: z.string().url("Must be a valid URL").or(z.string().length(0)).nullable().optional(),
  featuredImage: z.string().url("Must be a valid URL").or(z.string().length(0)).nullable().optional(),
  featuredImageAlt: z.string().nullable().optional(),
  status: PublishStatusEnum.default("DRAFT"),
  newsType: NewsTypeEnum.default("NEWS"),
  viewCount: z.number().default(0),
  readingTime: z.number().int().positive().nullable().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  authorId: z.string(),
  createdById: z.string().nullable().optional(),
  updatedById: z.string().nullable().optional(),
  publishedById: z.string().nullable().optional(),
  tags: z.array(ZCITagSchema).optional(),
})
export type ZTCNews = z.infer<typeof ZCINewsSchema>

export const ZCICreateNewsSchema = ZCINewsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  viewCount: true,
})
export type ZTCCreateNews = z.infer<typeof ZCICreateNewsSchema>
export type ZTCCreateNewsInput = z.input<typeof ZCICreateNewsSchema>

export const ZCIUpdateNewsSchema = ZCICreateNewsSchema.partial()
export type ZTCUpdateNews = z.infer<typeof ZCIUpdateNewsSchema>

export const ZCINewsOutputSchema = ZCINewsSchema.extend({
  author: ZCIAuthorSchema.optional().nullable(),
})
export type ZTCNewsOutput = z.infer<typeof ZCINewsOutputSchema>
