import { TRPCError } from "@trpc/server"
import { EventsService } from "./events.service.js"
import { EventPolicy } from "./event.policy.js"
import { EventVisibility, EventType } from "../../../generated/prisma/client.js"

export class EventsController {
  /**
   * Controller for resolving events listing based on visibility permissions (paginated)
   */
  static async getEventsList(params: {
    userRole: string | undefined
    page: number
    limit: number
  }) {
    const allowedVisibilities = EventPolicy.getAllowedVisibilities(params.userRole)
    return EventsService.getAllEvents({
      allowedVisibilities,
      page: params.page,
      limit: params.limit,
    })
  }

  /**
   * Controller for resolving a single event details by ID
   */
  static async getEventById(id: string, userRole: string) {
    const event = await EventsService.findEventById(id)
    if (!event) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" })
    }

    if (!EventPolicy.canView(userRole, event.visibility)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to view this event",
      })
    }

    return event
  }

  /**
   * Controller for creating an event (Super Admin only)
   */
  static async createEvent(data: {
    title: string
    description?: string
    startDate: Date
    endDate?: Date
    location: string
    coverImage?: string
    maxCapacity?: number
    meetingLink?: string
    visibility: EventVisibility
    eventType: EventType
    speakerName?: string
    recordingUrl?: string
    category?: string
  }) {
    try {
      return await EventsService.createEvent(data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to create event",
      })
    }
  }

  /**
   * Controller for registering a user for an event
   */
  static async registerUser(eventId: string, userId: string) {
    try {
      return await EventsService.registerUser(eventId, userId)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Registration failed",
      })
    }
  }

  /**
   * Controller for updating the recording URL of a webinar
   */
  static async updateWebinarRecording(eventId: string, recordingUrl: string) {
    try {
      return await EventsService.updateWebinarRecording(eventId, recordingUrl)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to update webinar recording URL",
      })
    }
  }
}
