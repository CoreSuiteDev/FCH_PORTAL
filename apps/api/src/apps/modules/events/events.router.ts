import { z } from "zod"
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../../../server/trpc.js"
import { EventsController } from "./events.controller.js"
import {
  ZCIEventSchema,
  ZCICreateEventSchema,
} from "@workspace/types"

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
  meetingLink: event.meetingLink,
  visibility: event.visibility,
  isActive: event.isActive,
  status: event.status,
  eventType: event.eventType,
  webinar: event.webinar
    ? {
        id: event.webinar.id,
        eventId: event.webinar.eventId,
        speakerName: event.webinar.speakerName,
        recordingUrl: event.webinar.recordingUrl,
        category: event.webinar.category,
        createdAt: event.webinar.createdAt,
      }
    : null,
})

export const eventsRouter = router({
  list: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/events",
        tags: ["events"],
        summary: "List all events",
        description: "Returns an array of registered upcoming events based on user access levels",
      },
    })
    .input(z.void())
    .output(z.array(ZCIEventSchema))
    .query(async ({ ctx }) => {
      const events = await EventsController.getEventsList(ctx.role)
      return events.map(mapEvent)
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
      const event = await EventsController.getEventById(input.id, ctx.role)
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

  updateRecording: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/events/{id}/recording",
        tags: ["events"],
        summary: "Add/update webinar recording",
        description: "Sets the recording URL for a webinar event (Super Admin only)",
      },
    })
    .input(
      z.object({
        id: z.string(),
        recordingUrl: z.string().url("Must be a valid URL"),
      })
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      await EventsController.updateWebinarRecording(input.id, input.recordingUrl)
      return { success: true }
    }),
})
