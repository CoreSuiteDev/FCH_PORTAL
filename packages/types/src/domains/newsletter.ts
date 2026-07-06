import { z } from "zod";

export const ZCICNewsletterSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  createdAt: z.coerce.date(),
});
export type ZTNewsletter = z.infer<typeof ZCICNewsletterSchema>;

export const ZCICreateNewsletterSchema = z.object({
  firstName: z.string().min(1, "First name must be at least 1 character long"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
});
export type ZTCreateNewsletter = z.infer<typeof ZCICreateNewsletterSchema>;
