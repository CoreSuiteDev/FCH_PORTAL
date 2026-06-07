import { z } from "zod";
import { router, publicProcedure } from "../../../server/trpc.js";
import { UserController } from "./user.controller.js";

export const userRouter = router({
  getProfile: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/users/profile/{userId}",
        tags: ["users"],
        summary: "Get user profile details",
        description: "Returns a user profile record from the database"
      },
    })
    .input(z.object({ userId: z.string() }))
    .output(z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      emailVerified: z.boolean(),
      image: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }))
    .query(async ({ input }) => {
      return UserController.getUserProfile({ userId: input.userId });
    }),

  listMembers: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/users/list",
        tags: ["users"],
        summary: "List all registered members",
        description: "Returns an array of all members"
      },
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      emailVerified: z.boolean(),
      image: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })))
    .query(async () => {
      return UserController.listAllMembers();
    }),
});
