import { z } from "zod";
import { ZCIUserOutputSchema } from "./auth";

// --- PAGINATION SCHEMAS ---

export const PaginationInputSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export type ZTPaginationInput = z.infer<typeof PaginationInputSchema>;

export const PaginationMetaSchema = z.object({
  totalCount: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
export type ZTPaginationMeta = z.infer<typeof PaginationMetaSchema>;

export const ZCIPaginatedUsersSchema = z.object({
  data: z.array(ZCIUserOutputSchema),
  meta: PaginationMetaSchema,
});
export type ZTPaginatedUsers = z.infer<typeof ZCIPaginatedUsersSchema>;
