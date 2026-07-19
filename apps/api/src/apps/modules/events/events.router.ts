import { z } from "zod"
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../../../server/trpc.js"
import { EventsController } from "./events.controller.js"
import {
  ZCIEventSchema,
  ZCICreateEventSchema,
  ZCIUpdateEventSchema,
  PaginationInputSchema,
  ZCIPaginatedEventsSchema,
  ZCIEventCategorySchema,
  ZCICreateEventCategorySchema,
  ZCIUpdateEventCategorySchema,
  ZCIEventMaterialSchema,
  ZCICreateMaterialSchema,
  ZCIEventAnalyticsSchema,
} from "@workspace/types"
import { getPaginationMeta } from "../../../utils/pagination.js"

// Helper to map DB Event records (including webinars) to matching Zod schemas
const mapEvent = (event: any) => ({
  id: event.id,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt,
  title: event.title,
  description: event.description,
  startDate: event.startDate,
  endDate: event.endDate,
  location: event.location,
  coverImage: event.coverImage,
  maxCapacity: event.maxCapacity,
  currentCount: event.currentCount,
  meetingLink: event.meetingLink,
  visibility: event.visibility,
  isActive: event.isActive,
  status: event.status,
  eventType: event.eventType,
  categories: event.categories
    ? event.categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }))
    : [],
  webinar: event.webinar
    ? {
        id: event.webinar.id,
        eventId: event.webinar.eventId,
        speakers: event.webinar.speakers,
        createdAt: event.webinar.createdAt,
      }
    : null,
  materials: event.materials
    ? event.materials.map((m: any) => ({
        id: m.id,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        title: m.title,
        fileUrl: m.fileUrl,
        fileType: m.fileType,
        eventId: m.eventId,
      }))
    : [],
  registrations: event.eventRegistrations
    ? event.eventRegistrations.map((r: any) => ({
        id: r.id,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        eventId: r.eventId,
        userId: r.userId,
        status: r.status,
        checkedIn: r.checkedIn,
      }))
    : [],
})

export const eventsRouter = router({
  list: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/events",
        tags: ["events"],
        summary: "List all events",
        description: "Returns a paginated list of registered upcoming events based on user access levels",
      },
    })
    .input(
      PaginationInputSchema.extend({
        eventType: z.enum(["EVENT", "WEBINAR"]).optional(),
      }).optional()
    )
    .output(ZCIPaginatedEventsSchema)
    .query(async ({ input, ctx }) => {
      const page = input?.page ?? 1
      const limit = input?.limit ?? 10
      const eventType = input?.eventType
      const { totalCount, data } = await EventsController.getEventsList({
        userRole: ctx.role,
        page,
        limit,
        userId: ctx.user?.id,
        eventType,
      })
      return {
        data: data.map(mapEvent),
        meta: getPaginationMeta(totalCount, page, limit),
      }
    }),

  listPublic: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/events/public",
        tags: ["events"],
        summary: "List public events",
        description: "Returns a paginated list of public and free events/webinars only",
      },
    })
    .input(
      PaginationInputSchema.extend({
        eventType: z.enum(["EVENT", "WEBINAR"]).optional(),
      }).optional()
    )
    .output(ZCIPaginatedEventsSchema)
    .query(async ({ input }) => {
      const page = input?.page ?? 1
      const limit = input?.limit ?? 10
      const eventType = input?.eventType
      const { totalCount, data } = await EventsController.getPublicEventsList({
        page,
        limit,
        eventType,
      })
      return {
        data: data.map(mapEvent),
        meta: getPaginationMeta(totalCount, page, limit),
      }
    }),

  getById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/events/{id}",
        tags: ["events"],
        summary: "Get event by ID",
        description: "Returns event details if permitted by user role",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(ZCIEventSchema)
    .query(async ({ input, ctx }) => {
      const event = await EventsController.getEventById(input.id, ctx.role, ctx.user?.id)
      return mapEvent(event)
    }),

  create: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/events",
        tags: ["events"],
        summary: "Create a new event",
        description: "Provisions a new event or webinar (Super Admin only)",
      },
    })
    .input(ZCICreateEventSchema)
    .output(ZCIEventSchema)
    .mutation(async ({ input }) => {
      const event = await EventsController.createEvent(input)
      return mapEvent(event)
    }),

  register: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/events/{id}/register",
        tags: ["events"],
        summary: "Register for an event",
        description: "Enrolls the authenticated user to the event",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean(), message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await EventsController.registerUser(input.id, ctx.user.id)
      return { success: true, message: "Successfully registered for event" }
    }),


  update: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/events/{id}",
        tags: ["events"],
        summary: "Update event details",
        description: "Updates an existing event's details (Super Admin only)",
      },
    })
    .input(
      ZCIUpdateEventSchema.extend({
        id: z.string(),
      })
    )
    .output(ZCIEventSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      const event = await EventsController.updateEvent(id, data)
      return mapEvent(event)
    }),

  delete: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/events/{id}",
        tags: ["events"],
        summary: "Delete event",
        description: "Permanently deletes an event record (Super Admin only)",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return EventsController.deleteEvent(input.id)
    }),

  checkin: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/events/{id}/checkin",
        tags: ["events"],
        summary: "Check in to an event",
        description: "Marks a user's event registration as checked-in (Admin can check in others)",
      },
    })
    .input(
      z.object({
        id: z.string(),
        userId: z.string().optional(),
      })
    )
    .output(z.object({ success: z.boolean(), message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const targetUserId = input.userId || ctx.user.id
      await EventsController.checkInUser({
        eventId: input.id,
        targetUserId,
        requestUserId: ctx.user.id,
        requestUserRole: ctx.role,
      })
      return { success: true, message: "Successfully checked in user to event" }
    }),

  listCategories: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/event-categories",
        tags: ["events"],
        summary: "List all event categories",
        description: "Returns an array of all defined event categories",
      },
    })
    .input(z.void())
    .output(z.array(ZCIEventCategorySchema))
    .query(async () => {
      return EventsController.getAllCategories()
    }),

  createCategory: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/event-categories",
        tags: ["events"],
        summary: "Create a new event category",
        description: "Provisions a new event category (Super Admin only)",
      },
    })
    .input(ZCICreateEventCategorySchema)
    .output(ZCIEventCategorySchema)
    .mutation(async ({ input }) => {
      return EventsController.createCategory(input)
    }),

  updateCategory: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/event-categories/{id}",
        tags: ["events"],
        summary: "Update event category details",
        description: "Updates an existing event category's details (Super Admin only)",
      },
    })
    .input(
      ZCIUpdateEventCategorySchema.extend({
        id: z.string(),
      })
    )
    .output(ZCIEventCategorySchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return EventsController.updateCategory(id, data)
    }),

  deleteCategory: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/event-categories/{id}",
        tags: ["events"],
        summary: "Delete event category",
        description: "Permanently deletes an event category from the database (Super Admin only)",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return EventsController.deleteCategory(input.id)
    }),

  addMaterial: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/events/{id}/materials",
        tags: ["events"],
        summary: "Add a material to an event",
        description: "Uploads/registers a material (recording, PDF, docx, etc.) for an event (Super Admin only)",
      },
    })
    .input(
      ZCICreateMaterialSchema.extend({
        id: z.string(),
      })
    )
    .output(ZCIEventMaterialSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return EventsController.addMaterial(id, data)
    }),

  listMaterials: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/events/{id}/materials",
        tags: ["events"],
        summary: "List all materials of an event",
        description: "Returns an array of all materials for a given event",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.array(ZCIEventMaterialSchema))
    .query(async ({ input, ctx }) => {
      return EventsController.getMaterials(input.id, ctx.role)
    }),

  deleteMaterial: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/events/{id}/materials/{materialId}",
        tags: ["events"],
        summary: "Delete an event material",
        description: "Permanently deletes a material from an event (Super Admin only)",
      },
    })
    .input(
      z.object({
        id: z.string(),
        materialId: z.string(),
      })
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return EventsController.deleteMaterial(input.id, input.materialId)
    }),

  listRegistrations: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/events/{id}/registrations",
        tags: ["events"],
        summary: "List all registrations for an event",
        description: "Returns all registrations with user details for a specific event (Admin only)",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(
      z.array(
        z.object({
          id: z.string(),
          eventId: z.string(),
          userId: z.string(),
          status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
          checkedIn: z.boolean(),
          registeredAt: z.coerce.date(),
          user: z.object({
            id: z.string(),
            name: z.string().nullable(),
            email: z.string().nullable(),
            image: z.string().nullable(),
          }),
        })
      )
    )
    .query(async ({ input }) => {
      return EventsController.getEventRegistrations(input.id)
    }),

  getAnalytics: adminProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/events/{id}/analytics",
        tags: ["events"],
        summary: "Get event analytics",
        description: "Fetch analytics and registration breakdowns for a specific event (Admin and Super Admin only)",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(ZCIEventAnalyticsSchema)
    .query(async ({ input }) => {
      return EventsController.getEventAnalytics(input.id)
    }),
})
