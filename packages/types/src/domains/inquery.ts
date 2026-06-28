import { z } from "zod";
import { PaginationMetaSchema } from "./pagination"

// --- CONTACT INQUIRY SCHEMAS ---

export const ZCIContactInquerySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email("Invalid email address"),
  phone: z.string(),
  message: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type ZTContactInquery = z.infer<typeof ZCIContactInquerySchema>;

export const ZCICreateInquerySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required"),
});
export type ZTCreateInquery = z.infer<typeof ZCICreateInquerySchema>;

export const ZCIUpdateInquerySchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
});
export type ZTUpdateInquery = z.infer<typeof ZCIUpdateInquerySchema>;

export const ZCIPaginatedInqueriesSchema = z.object({
  data: z.array(ZCIContactInquerySchema),
  meta: PaginationMetaSchema,
});
export type ZTPaginatedInqueries = z.infer<typeof ZCIPaginatedInqueriesSchema>;
