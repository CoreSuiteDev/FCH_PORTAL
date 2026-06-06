import { z } from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
}

// Zod Schema
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
