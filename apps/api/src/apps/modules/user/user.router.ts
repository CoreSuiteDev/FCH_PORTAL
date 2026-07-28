import { z } from "zod"
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../../../server/trpc.js"
import { UserController } from "./user.controller.js"
import { ZCIUserOutputSchema, PaginationInputSchema, ZCIPaginatedUsersSchema } from "@workspace/types"
import { getPaginationMeta } from "../../../utils/pagination.js"

// Helper to map DB relations to Zod output schema format
const mapUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  image: user.image,
  status: user.status,
  passwordChangeRequired: user.passwordChangeRequired,
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
  getProfile: protectedProcedure
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

  listMembers: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/users/list",
        tags: ["users"],
        summary: "List all registered members",
        description: "Returns a paginated list of all members",
      },
    })
    .input(PaginationInputSchema.optional())
    .output(ZCIPaginatedUsersSchema)
    .query(async ({ input }) => {
      const page = input?.page ?? 1
      const limit = input?.limit ?? 10
      const { totalCount, data } = await UserController.listAllMembers({ page, limit })
      return {
        data: data.map(mapUser),
        meta: getPaginationMeta(totalCount, page, limit),
      }
    }),

  updateStatus: adminProcedure
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

  deleteUser: adminProcedure
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

  createMember: adminProcedure
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

  updateRole: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/users/{userId}/role",
        tags: ["users"],
        summary: "Update user role hierarchy",
        description: "Re-assigns user role clearances (e.g., BOARD, PASTORAL, MEMBER, SUPER_ADMIN)"
      },
    })
    .input(
      z.object({
        userId: z.string(),
        role: z.string(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        role: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return UserController.updateUserRole(input)
    }),

  createBoardMember: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/users/create-board",
        tags: ["users"],
        summary: "Create a new board member",
        description: "Provisions a new board member account with a temporary password"
      },
    })
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        user: ZCIUserOutputSchema,
      })
    )
    .mutation(async ({ input }) => {
      const user = await UserController.createBoardMember(input)
      return {
        success: true,
        user: mapUser(user),
      }
    }),

  filterUsers: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/users/filter",
        tags: ["users"],
        summary: "Filter registered users",
        description: "Returns a paginated list of filtered users",
      },
    })
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
        skip: z.number().int().optional(),
        search: z.string().optional().default(""),
        status: z.enum(["ACTIVE", "RESTRICTED", "SUSPENDED", "BANNED", "ALL" as any]).optional().default("ALL" as any),
        role: z.string().optional().default("ALL"),
        createdAt: z.string().optional().default(""),
      })
    )
    .output(ZCIPaginatedUsersSchema)
    .query(async ({ input }) => {
      const page = input.page
      const limit = input.limit
      const skip = input.skip ?? (page - 1) * limit
      const { totalCount, data } = await UserController.filterUser({
        page,
        limit,
        skip,
        search: input.search,
        status: input.status as any,
        role: input.role,
        createdAt: input.createdAt,
      })
      return {
        data: data.map(mapUser),
        meta: getPaginationMeta(totalCount, page, limit),
      }
    }),

  getUserMatrix: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/users/matrix",
        tags: ["users"],
        summary: "Get user metrics matrix",
        description: "Returns aggregated status and role metrics for users",
      },
    })
    .input(z.object({}))
    .output(
      z.object({
        total: z.number(),
        activeCount: z.number(),
        suspendedCount: z.number(),
        restrictedCount: z.number(),
        generalCount: z.number(),
        pastoralCount: z.number(),
        boardCount: z.number(),
      })
    )
    .query(async () => {
      return UserController.getUserMatrix()
    }),

  getMemberDetails: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/users/{userId}/details",
        tags: ["users"],
        summary: "Get member detailed activities and history",
        description: "Returns roles, activity states, subscription details, donations, sponsorships, and full transaction history",
      },
    })
    .input(z.object({ userId: z.string() }))
    .output(
      z.object({
        user: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          phone: z.string().nullable(),
          image: z.string().nullable(),
          status: z.string(),
          createdAt: z.date(),
          roles: z.array(z.string()),
        }),
        membership: z.object({
          hasActiveMembership: z.boolean(),
          activePackageName: z.string().nullable(),
          activePeriodStart: z.date().nullable(),
          activePeriodEnd: z.date().nullable(),
          totalPurchases: z.number(),
          subscriptions: z.array(
            z.object({
              id: z.string(),
              packageName: z.string(),
              packageType: z.string(),
              price: z.number(),
              status: z.string(),
              startsAt: z.date(),
              expiresAt: z.date(),
              createdAt: z.date(),
            })
          ),
        }),
        donations: z.object({
          hasDonated: z.boolean(),
          totalCount: z.number(),
          totalAmount: z.number(),
          list: z.array(
            z.object({
              id: z.string(),
              amount: z.number(),
              currency: z.string(),
              status: z.string(),
              createdAt: z.date(),
              isAnonymous: z.boolean(),
              message: z.string().nullable(),
            })
          ),
        }),
        sponsorships: z.object({
          hasSponsored: z.boolean(),
          totalCount: z.number(),
          totalAmount: z.number(),
          list: z.array(
            z.object({
              id: z.string(),
              packageName: z.string(),
              tier: z.string(),
              amount: z.number(),
              status: z.string(),
              startsAt: z.date().nullable(),
              expiresAt: z.date().nullable(),
              createdAt: z.date(),
            })
          ),
        }),
        transactionHistory: z.array(
          z.object({
            id: z.string(),
            amount: z.number(),
            currency: z.string(),
            status: z.string(),
            createdAt: z.date(),
            type: z.string(),
            description: z.string(),
          })
        ),
      })
    )
    .query(async ({ input }) => {
      return UserController.getMemberDetails({ userId: input.userId })
    }),

  getAdminOverview: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/users/admin-overview",
        tags: ["users"],
        summary: "Get admin overview matrix and operational stats",
        description: "Returns statistics for users, revenue, recent activities, chart data, and platform upkeep logs",
      },
    })
    .input(z.object({}))
    .output(
      z.object({
        membersCount: z.object({
          total: z.number(),
          active: z.number(),
          suspended: z.number(),
          restricted: z.number(),
          roles: z.object({
            SUPER_ADMIN: z.number(),
            ADMIN: z.number(),
            BOARD: z.number(),
            PASTORAL: z.number(),
            MEMBER: z.number(),
            USER: z.number(),
          }),
        }),
        revenue: z.object({
          total: z.number(),
          subscriptions: z.number(),
          donations: z.number(),
          sponsorships: z.number(),
        }),
        recentBoardMembers: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.string(),
            createdAt: z.date(),
          })
        ),
        recentDonations: z.array(
          z.object({
            id: z.string(),
            amount: z.number(),
            currency: z.string(),
            status: z.string(),
            createdAt: z.date(),
            donatorName: z.string(),
          })
        ),
        recentSponsorships: z.array(
          z.object({
            id: z.string(),
            amount: z.number(),
            currency: z.string(),
            status: z.string(),
            createdAt: z.date(),
            sponsorName: z.string(),
            packageName: z.string(),
          })
        ),
        pendingTasks: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            priority: z.string(),
          })
        ),
        membershipTrends: z.array(
          z.object({
            month: z.string(),
            general: z.number(),
            pastoral: z.number(),
            board: z.number(),
            revenue: z.number(),
          })
        ),
        platformUpkeepMetrics: z.array(
          z.object({
            id: z.number(),
            label: z.string(),
            value: z.string(),
          })
        ),
      })
    )
    .query(async () => {
      return UserController.getAdminOverview()
    }),
})

