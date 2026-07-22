import { z } from "zod"
import { router, protectedProcedure, adminProcedure } from "../../../server/trpc.js"
import { MeetingsController } from "./meetings.controller.js"
import { TRPCError } from "@trpc/server"

export const meetingsRouter = router({
  listMeetings: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/meetings",
        tags: ["meetings"],
        summary: "List all board meetings",
        description: "Returns upcoming and past board meetings matching user's permissions",
      },
    })
    .input(z.void())
    .output(z.array(z.any()))
    .query(async ({ ctx }) => {
      // Allow Board members, Admins and Super Admins
      const userRoles = (ctx.user as any)?.roles || []
      const hasAccess =
        userRoles.includes("BOARD") ||
        userRoles.includes("ADMIN") ||
        userRoles.includes("SUPER_ADMIN") ||
        ctx.role === "BOARD" ||
        ctx.role === "SUPER_ADMIN"

      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only board members or admins can access board meetings",
        })
      }

      return MeetingsController.listMeetings({
        userId: ctx.user.id,
        userRole: ctx.role,
      })
    }),

  createMeeting: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/meetings",
        tags: ["meetings"],
        summary: "Create board meeting",
        description: "Creates a new scheduled board meeting (Super Admin/Admin only)",
      },
    })
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        date: z.string().transform((str) => new Date(str)),
        duration: z.number().int().min(1, "Duration must be at least 1 minute"),
        meetingLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
        meetingType: z.enum(["ONE_TO_ONE", "ONE_TO_MANY"]),
        attendeeIds: z.array(z.string()).optional(),
        requestId: z.string().optional(),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const { meetingLink, ...rest } = input
      return MeetingsController.createMeeting({
        ...rest,
        meetingLink: meetingLink || undefined,
      })
    }),

  submitRequest: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/meetings/requests",
        tags: ["meetings"],
        summary: "Submit a meeting request",
        description: "Submits a request for a board meeting (Board members only)",
      },
    })
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        reason: z.string().min(1, "Reason is required"),
        date: z.string().transform((str) => new Date(str)),
      })
    )
    .output(z.any())
    .mutation(async ({ input, ctx }) => {
      const userRoles = (ctx.user as any)?.roles || []
      const isBoardMember = userRoles.includes("BOARD") || ctx.role === "BOARD"

      if (!isBoardMember) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only board members can submit meeting requests",
        })
      }

      return MeetingsController.submitRequest({
        userId: ctx.user.id,
        ...input,
      })
    }),

  listRequests: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/meetings/requests",
        tags: ["meetings"],
        summary: "List all meeting requests",
        description: "Returns all board member meeting requests (Super Admin/Admin only)",
      },
    })
    .input(z.void())
    .output(z.array(z.any()))
    .query(async () => {
      return MeetingsController.listRequests()
    }),

  myRequests: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/meetings/requests/my",
        tags: ["meetings"],
        summary: "List my meeting requests",
        description: "Returns board meeting requests submitted by the logged-in Board member",
      },
    })
    .input(z.void())
    .output(z.array(z.any()))
    .query(async ({ ctx }) => {
      const userRoles = (ctx.user as any)?.roles || []
      const isBoardMember = userRoles.includes("BOARD") || ctx.role === "BOARD"

      if (!isBoardMember) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only board members can view their requests",
        })
      }

      return MeetingsController.myRequests(ctx.user.id)
    }),

  updateRequestStatus: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/meetings/requests/{id}/status",
        tags: ["meetings"],
        summary: "Update request status",
        description: "Approves or rejects a board meeting request (Super Admin/Admin only)",
      },
    })
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      return MeetingsController.updateRequestStatus(input.id, input.status)
    }),

  updateMeeting: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/meetings/{id}",
        tags: ["meetings"],
        summary: "Update or reschedule board meeting",
        description: "Reschedules or updates an existing board meeting (Super Admin/Admin only)",
      },
    })
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        date: z.string().optional().transform((str) => (str ? new Date(str) : undefined)),
        duration: z.number().int().min(1, "Duration must be at least 1 minute").optional(),
        meetingLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
        meetingType: z.enum(["ONE_TO_ONE", "ONE_TO_MANY"]).optional(),
        attendeeIds: z.array(z.string()).optional(),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const { meetingLink, ...rest } = input
      return MeetingsController.updateMeeting({
        ...rest,
        meetingLink: meetingLink || undefined,
      })
    }),
})
