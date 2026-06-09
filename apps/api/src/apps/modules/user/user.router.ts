import { z } from "zod"
import { router, publicProcedure } from "../../../server/trpc.js"
import { UserController } from "./user.controller.js"
import { ZCIUserOutputSchema } from "@workspace/types"

// Helper to map DB relations to Zod output schema format
const mapUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  image: user.image,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  roles: user.userRoles ? user.userRoles.map((ur: any) => ur.role.name) : [],
  memberships: user.memberships
    ? user.memberships.map((m: any) => ({
        id: m.id,
        type: m.type,
        status: m.status,
        startsAt: m.startsAt,
        expiresAt: m.expiresAt,
      }))
    : [],
  payments: user.payments
    ? user.payments.map((p: any) => ({
        id: p.id,
        amount: Number(p.amount),
        status: p.status,
        createdAt: p.createdAt,
      }))
    : [],
})

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
    .output(ZCIUserOutputSchema)
    .query(async ({ input }) => {
      const user = await UserController.getUserProfile({ userId: input.userId })
      return mapUser(user)
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
    .output(z.array(ZCIUserOutputSchema))
    .query(async () => {
      const users = await UserController.listAllMembers()
      return users.map(mapUser)
    }),

  updateStatus: publicProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/users/{userId}/status",
        tags: ["users"],
        summary: "Update user operational status",
        description: "Sets the user status to ACTIVE, RESTRICTED, SUSPENDED, or BANNED"
      },
    })
    .input(
      z.object({
        userId: z.string(),
        status: z.enum(["ACTIVE", "RESTRICTED", "SUSPENDED", "BANNED"]),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        status: z.enum(["ACTIVE", "RESTRICTED", "SUSPENDED", "BANNED"]),
      })
    )
    .mutation(async ({ input }) => {
      return UserController.updateUserStatus({
        userId: input.userId,
        status: input.status,
      })
    }),

  deleteUser: publicProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/users/{userId}",
        tags: ["users"],
        summary: "Delete user account",
        description: "Permanently deletes a user record from the database"
      },
    })
    .input(z.object({ userId: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return UserController.deleteUser({ userId: input.userId })
    }),

  createMember: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/users/create",
        tags: ["users"],
        summary: "Create a new member",
        description: "Provisions a new member account with an optional status and membership tier"
      },
    })
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        status: z.enum(["ACTIVE", "RESTRICTED", "SUSPENDED", "BANNED"]).optional(),
        tier: z.enum(["GENERAL", "PASTORAL"]).optional(),
      })
    )
    .output(ZCIUserOutputSchema)
    .mutation(async ({ input }) => {
      const user = await UserController.createMember(input)
      return mapUser(user)
    }),
})

