import { TRPCError } from "@trpc/server"
import { EventsService } from "./events.service.js"
import { EventPolicy } from "./event.policy.js"
import { EventVisibility, EventType, EventStatus } from "../../../generated/prisma/client.js"

export class EventsController {
  /**
   * Controller for resolving events listing based on visibility permissions (paginated)
   * @param params - Request parameters including user role, page, limit, and optional user ID
   * @returns Object containing total event count and paginated event data
   */
  static async getEventsList(params: {
    userRole: string | undefined
    page: number
    limit: number
    userId?: string
    eventType?: EventType
  }) {
    const allowedVisibilities = EventPolicy.getAllowedVisibilities(params.userRole)
    return EventsService.getAllEvents({
      allowedVisibilities,
      page: params.page,
      limit: params.limit,
      userId: params.userId,
      eventType: params.eventType,
    })
  }

  /**
   * Controller for resolving a single event details by ID
   */
  static async getEventById(id: string, userRole: string, userId?: string) {
    const event = await EventsService.findEventById(id, userId)
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
    speakers?: string[]
    categoryIds?: string[]
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
   * Controller for updating an event (Super Admin only)
   */
  static async updateEvent(
    id: string,
    data: {
      title?: string
      description?: string
      startDate?: Date
      endDate?: Date
      location?: string
      coverImage?: string
      maxCapacity?: number
      meetingLink?: string
      visibility?: EventVisibility
      eventType?: EventType
      speakers?: string[]
      categoryIds?: string[]
      isActive?: boolean
      status?: EventStatus
    }
  ) {
    try {
      return await EventsService.updateEvent(id, data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to update event",
      })
    }
  }

  /**
   * Controller for deleting an event (Super Admin only)
   */
  static async deleteEvent(id: string) {
    try {
      await EventsService.deleteEvent(id)
      return { success: true }
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to delete event",
      })
    }
  }

  /**
   * Controller for checking in a user (with role verification)
   */
  static async checkInUser(params: {
    eventId: string
    targetUserId: string
    requestUserId: string
    requestUserRole: string
  }) {
    const { eventId, targetUserId, requestUserId, requestUserRole } = params

    // If attempting to check in a user other than oneself, user must be an Admin or Super Admin
    if (targetUserId !== requestUserId && requestUserRole !== "SUPER_ADMIN" && requestUserRole !== "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to check in other users",
      })
    }

    try {
      return await EventsService.checkInUser(eventId, targetUserId)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Check-in failed",
      })
    }
  }

  /**
   * Controller for fetching all event categories
   */
  static async getAllCategories() {
    try {
      return await EventsService.getAllCategories()
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to fetch event categories",
      })
    }
  }

  /**
   * Controller for creating an event category (Super Admin only)
   */
  static async createCategory(data: { name: string; description?: string }) {
    try {
      return await EventsService.createCategory(data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to create category",
      })
    }
  }

  /**
   * Controller for updating an event category (Super Admin only)
   */
  static async updateCategory(id: string, data: { name?: string; description?: string }) {
    try {
      return await EventsService.updateCategory(id, data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to update category",
      })
    }
  }

  /**
   * Controller for deleting an event category (Super Admin only)
   */
  static async deleteCategory(id: string) {
    try {
      await EventsService.deleteCategory(id)
      return { success: true }
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to delete category",
      })
    }
  }

  /**
   * Controller for adding a material to an event (Super Admin only)
   */
  static async addMaterial(
    eventId: string,
    data: { title: string; fileUrl: string; fileType: string }
  ) {
    try {
      return await EventsService.addMaterial(eventId, data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to add material",
      })
    }
  }

  /**
   * Controller for fetching event materials (checks visibility policy)
   */
  static async getMaterials(eventId: string, userRole: string) {
    const event = await EventsService.findEventById(eventId)
    if (!event) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" })
    }

    if (!EventPolicy.canView(userRole, event.visibility)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to view this event's materials",
      })
    }

    try {
      return await EventsService.getMaterials(eventId)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to fetch materials",
      })
    }
  }

  /**
   * Controller for deleting an event material (Super Admin only)
   */
  static async deleteMaterial(eventId: string, materialId: string) {
    try {
      await EventsService.deleteMaterial(eventId, materialId)
      return { success: true }
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to delete material",
      })
    }
  }

  /**
   * Controller for fetching all registrations for an event (Admin only)
   */
  static async getEventRegistrations(eventId: string) {
    try {
      return await EventsService.getEventRegistrations(eventId)
    } catch (err: any) {
      if (err.message === "Event not found") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        })
      }
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to fetch event registrations",
      })
    }
  }

  /**
   * Controller for fetching event analytics (restricted to Admins and Super Admins)
   */
  static async getEventAnalytics(eventId: string) {
    try {
      return await EventsService.getEventAnalytics(eventId)
    } catch (err: any) {
      if (err.message === "Event not found") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        })
      }
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to fetch event analytics",
      })
    }
  }
}

