import { z } from "zod";
import { router, publicProcedure } from "../../../server/trpc.js";
import { AuthController } from "./auth.controller.js";

export const authRouter = router({
  session: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/auth/session/{userId}",
        tags: ["auth"],
        summary: "Check authentication session status",
        description: "Returns authentication status and role of a user"
      },
    })
    .input(z.object({ userId: z.string() }))
    .output(z.object({
      authenticated: z.boolean(),
      userId: z.string(),
      role: z.string(),
    }))
    .query(async ({ input }) => {
      return AuthController.getSessionStatus({ userId: input.userId });
    }),
});
