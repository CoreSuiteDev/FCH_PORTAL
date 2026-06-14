import { prisma } from "../../../infrastructure/database/prisma.js"
import { EventVisibility, EventType, EventStatus } from "../../../generated/prisma/client.js"

export class EventsService {
  /**
   * Fetch registered events that are active and visible (paginated)
   */
  static async getAllEvents(params: {
    allowedVisibilities: EventVisibility[]
    page: number
    limit: number
  }) {
    const { allowedVisibilities, page, limit } = params
    const skip = (page - 1) * limit

    const whereClause = {
      isActive: true,
      visibility: {
        in: allowedVisibilities,
      },
    }

    const [totalCount, data] = await prisma.$transaction([
      prisma.event.count({
        where: whereClause,
      }),
      prisma.event.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: { webinar: true },
        orderBy: { startDate: "asc" },
      }),
    ])

    return { totalCount, data }
  }

  /**
   * Find a single event by ID
   */
  static async findEventById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: { webinar: true },
    })
  }

  /**
   * Create a new event (with optional webinar details)
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
    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        coverImage: data.coverImage,
        maxCapacity: data.maxCapacity,
        meetingLink: data.meetingLink,
        visibility: data.visibility,
        eventType: data.eventType,
        status: "UPCOMING" as EventStatus,
        isActive: true,
        ...(data.eventType === "WEBINAR"
          ? {
              webinar: {
                create: {
                  speakerName: data.speakerName || "TBD",
                  recordingUrl: data.recordingUrl,
                  category: data.category,
                },
              },
            }
          : {}),
      },
      include: { webinar: true },
    })
  }

  /**
   * Register a user for an event with capacity limit validation
   */
  static async registerUser(eventId: string, userId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { eventRegistrations: true },
        },
      },
    })

    if (!event) {
      throw new Error("Event not found")
    }

    if (event.maxCapacity && event._count.eventRegistrations >= event.maxCapacity) {
      throw new Error("Event capacity limit has been reached")
    }

    return prisma.eventRegistration.create({
      data: {
        eventId,
        userId,
        status: "CONFIRMED",
      },
    })
  }

  /**
   * Add or update recording URL of a webinar event
   */
  static async updateWebinarRecording(eventId: string, recordingUrl: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { webinar: true },
    })

    if (!event) {
      throw new Error("Event not found")
    }

    if (event.eventType !== "WEBINAR") {
      throw new Error("Only Webinar events can have a recording URL")
    }

    return prisma.webinar.upsert({
      where: { eventId },
      update: { recordingUrl },
      create: {
        eventId,
        speakerName: "TBD",
        recordingUrl,
      },
    })
  }
}
