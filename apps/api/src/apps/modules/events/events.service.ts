import {
  EventStatus,
  EventType,
  EventVisibility,
} from "../../../generated/prisma/client.js"
import { prisma } from "../../../infrastructure/database/prisma.js"
import { UploadService } from "../upload/upload.service.js"

export class EventsService {
  /**
   * Fetch registered events that are active and visible (paginated)
   */
  static async getAllEvents(params: {
    allowedVisibilities: EventVisibility[]
    page: number
    limit: number
    userId?: string
    eventType?: EventType
  }) {
    const { allowedVisibilities, page, limit, userId, eventType } = params
    const skip = (page - 1) * limit

    const whereClause: any = {
      isActive: true,
      visibility: {
        in: allowedVisibilities,
      },
    }

    if (eventType) {
      whereClause.eventType = eventType
    }

    const [totalCount, data] = await prisma.$transaction([
      prisma.event.count({
        where: whereClause,
      }),
      prisma.event.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          webinar: true,
          categories: true,
          materials: true,
          eventRegistrations: {
            where: {
              userId: userId || "",
            },
          },
        },
        orderBy: { startDate: "asc" },
      }),
    ])

    return { totalCount, data }
  }

  /**
   * Find a single event by ID
   */
  static async findEventById(id: string, userId?: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        webinar: true,
        categories: true,
        materials: true,
        eventRegistrations: {
          where: {
            userId: userId || "",
          },
        },
      },
    })
  }

  /**
   * Private helper to handle and upload cover image to Cloudflare R2
   */
  private static async handleCoverImage(coverImage?: string): Promise<string | undefined> {
    if (!coverImage) return undefined

    let base64Data: string | null = null
    let mimetype = "image/jpeg"
    let extension = ".jpg"

    if (coverImage.startsWith("data:")) {
      const matches = coverImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        mimetype = matches[1] || "image/jpeg"
        base64Data = matches[2] || null

        if (mimetype.includes("png")) extension = ".png"
        else if (mimetype.includes("webp")) extension = ".webp"
        else if (mimetype.includes("gif")) extension = ".gif"
      }
    } else if (!coverImage.startsWith("http://") && !coverImage.startsWith("https://")) {
      base64Data = coverImage
    }

    if (base64Data) {
      const buffer = Buffer.from(base64Data, "base64")
      const file: Express.Multer.File = {
        fieldname: "file",
        originalname: `cover-image${extension}`,
        encoding: "base64",
        mimetype,
        buffer,
        size: buffer.byteLength,
        stream: null as any,
        destination: "",
        filename: `cover-image${extension}`,
        path: "",
      }

      const uploadResult = await UploadService.uploadFile(file, "events")
      return uploadResult.url
    }

    return coverImage
  }

  /**
   * Private helper to delete a file from Cloudflare R2 given its public URL
   */
  private static async deleteR2FileByUrl(url?: string | null) {
    if (!url) return

    const publicUrlBase = process.env.R2_PUBLIC_URL
    if (publicUrlBase && url.startsWith(publicUrlBase)) {
      const key = url.replace(publicUrlBase, "").replace(/^\//, "")
      if (key) {
        try {
          await UploadService.deleteFile(key)
        } catch (error) {
          console.error(`Failed to delete file from R2 (key: ${key}):`, error)
        }
      }
    }
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
    speakers?: string[]
    categoryIds?: string[]
  }) {
    const { categoryIds, speakers, ...eventData } = data

    const title = eventData.title?.trim()
    const location = eventData.location.trim();

    if (!title) {
      throw new Error("Event title is required")
    }

    if(!location) {
      throw new Error("Event location is required")
    }

    if (!eventData.startDate) {
      throw new Error("Start date is required")
    }

    const startDate = new Date(eventData.startDate)

    if (Number.isNaN(startDate.getTime())) {
      throw new Error("Invalid start date")
    }

    if (eventData.endDate) {
      const endDate = new Date(eventData.endDate)

      if (Number.isNaN(endDate.getTime())) {
        throw new Error("Invalid end date")
      }

      if (endDate <= startDate) {
        throw new Error("End date must be greater than start date")
      }
    }

    if (eventData.maxCapacity && eventData.maxCapacity < 1) {
      throw new Error("Max capacity must be greater than 0")
    }

    // Category validation & dynamic eventType resolution
    let resolvedEventType: EventType = EventType.EVENT
    if (categoryIds && categoryIds.length > 0) {
      const categories = await prisma.eventCategory.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true },
      })

      if (categories.length !== categoryIds.length) {
        throw new Error("One or more categories do not exist")
      }

      const hasWebinar = categories.some((c) => c.name.toLowerCase().includes("webinar"))
      if (hasWebinar) {
        resolvedEventType = EventType.WEBINAR
      }
    }

    // Webinar validation
    if (resolvedEventType === EventType.WEBINAR) {
      if (!eventData.meetingLink?.trim()) {
        throw new Error("Meeting link is required for webinars")
      }

      try {
        new URL(eventData.meetingLink)
      } catch {
        throw new Error("Invalid meeting link URL")
      }
    }

    // Non-webinar validation
    if (resolvedEventType !== EventType.WEBINAR && eventData.meetingLink) {
      throw new Error("Meeting link is only allowed for webinars")
    }

    const coverImageUrl = await EventsService.handleCoverImage(eventData.coverImage)

    return prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          title,
          description: eventData.description?.trim(),
          startDate,
          endDate: eventData.endDate,
          location,
          coverImage: coverImageUrl,
          maxCapacity: eventData.maxCapacity,
          meetingLink: eventData.meetingLink,
          visibility: eventData.visibility,
          eventType: resolvedEventType,
          status: "UPCOMING" as EventStatus,
          isActive: true,
          // connect expects { id: string }[], not string[]
          ...(categoryIds &&
            categoryIds.length > 0 && {
              categories: {
                connect: categoryIds.map((id) => ({ id })),
              },
            }),
          // speakers is optional — fall back to [] to satisfy the non-nullable DB column
          ...(resolvedEventType === EventType.WEBINAR && {
            webinar: {
              create: {
                speakers: speakers ?? [],
              },
            },
          }),
        },
        include: { webinar: true, categories: true, materials: true },
      })

      return event
    })
  }

  /**
   * Register a user for an event with capacity limit validation
   */
  static async registerUser(eventId: string, userId: string) {
    if (!eventId || !userId) {
      throw new Error("EventId and UserId are required")
    }

    return prisma.$transaction(async (tx) => {
      
      const event = await tx.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          isActive: true,
          status: true,
          maxCapacity: true,
        }
      })

      if (!event) throw new Error("Event not found")
      if (!event.isActive) throw new Error("Event is not active")

      if (event.status !== "UPCOMING") {
        throw new Error("Registration is closed for this event")
      }

      const registration = await tx.eventRegistration.create({
        data: {
          eventId,
          userId,
          status: "CONFIRMED",
        }
      })

      if(event.maxCapacity === null) {
        return registration
      }


      const result = await tx.event.updateMany({
        where: {
          id: eventId,
          currentCount: {
            lt: event.maxCapacity,
          }
        }, data: {
          currentCount: {
            increment: 1,
          }
        }
      })

      if(result.count === 0) {
        throw new Error("Event capacity limit has been reached")
      }

      return registration
    })
  }

  /**
   * Update an event and its optional webinar details
   */
  static async updateEvent(
    id: string,
    data: {
      title?: string
      description?: string
      startDate?: Date
      endDate?: Date
      location?: string
      coverImage?: string | null
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
    const { categoryIds, speakers, ...eventData } = data

    return prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: {
          id,
        },
        include: {
          webinar: true,
          _count: { select: { eventRegistrations: true } },
        },
      })

      if (!event) {
        throw new Error("Event not found")
      }

      if (
        typeof eventData.maxCapacity === "number" &&
        eventData.maxCapacity < event._count.eventRegistrations
      ) {
        throw new Error(
          "Max capacity cannot be less than current registrations"
        )
      }

      let newEventType = event.eventType
      if (categoryIds) {
        if (categoryIds.length > 0) {
          const categories = await tx.eventCategory.findMany({
            where: { id: { in: categoryIds } },
            select: { name: true },
          })
          const hasWebinar = categories.some((c) => c.name.toLowerCase().includes("webinar"))
          newEventType = hasWebinar ? "WEBINAR" : "EVENT"
        } else {
          newEventType = "EVENT"
        }
      }

      // Validate meeting link when switching to WEBINAR type
      if (newEventType === "WEBINAR") {
        if (event.eventType !== "WEBINAR" && !eventData.meetingLink?.trim()) {
          throw new Error("Meeting link is required when converting to a webinar")
        }
        if (eventData.meetingLink) {
          try {
            new URL(eventData.meetingLink)
          } catch {
            throw new Error("Invalid meeting link URL")
          }
        }
      }

      if (event.eventType === "WEBINAR" && newEventType !== "WEBINAR") {
        await tx.webinar.deleteMany({
          where: { eventId: id },
        })
      }

      let coverImageUrl = event.coverImage
      if (eventData.coverImage === "" || eventData.coverImage === null) {
        coverImageUrl = null
        if (event.coverImage) {
          await EventsService.deleteR2FileByUrl(event.coverImage)
        }
      } else if (eventData.coverImage) {
        const isNewUpload =
          eventData.coverImage.startsWith("data:") ||
          (!eventData.coverImage.startsWith("http://") && !eventData.coverImage.startsWith("https://"))

        const uploadedUrl = await EventsService.handleCoverImage(eventData.coverImage)
        coverImageUrl = uploadedUrl ?? null

        if (isNewUpload && event.coverImage) {
          await EventsService.deleteR2FileByUrl(event.coverImage)
        }
      }

      const updateEvent = await tx.event.update({
        where: { id },
        data: {
          ...eventData,
          coverImage: coverImageUrl !== undefined ? coverImageUrl : undefined,
          eventType: newEventType,

          ...(categoryIds && {
            categories: { set: categoryIds.map((cid) => ({ id: cid })) },
          }),

          ...(newEventType === "WEBINAR" && {
            webinar: {
              upsert: {
                create: {
                  speakers: speakers || [],
                },
                update: {
                  speakers: speakers || [],
                },
              },
            },
          }),
        },
        include: {
          webinar: true,
          categories: true,
          materials: true,
        },
      })

      return updateEvent
    })
  }

  /**
   * Delete an event by ID (and cascadingly delete webinars & registrations)
   */
  static async deleteEvent(id: string) {
    return prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id },
        include: {
          _count: {
            select: { eventRegistrations: true },
          },
        },
      })

      if (!event) {
        throw new Error("Event not found")
      }

      if (event._count.eventRegistrations > 0) {
        throw new Error("Cannot delete event with existing registrations")
      }

      if (event.coverImage) {
        await EventsService.deleteR2FileByUrl(event.coverImage)
      }

      // Webinar and materials cascade automatically via onDelete: Cascade in schema
      return tx.event.delete({ where: { id } })
    })
  }

  /**
   * Mark an event registration as checked-in
   */
  static async checkInUser(eventId: string, userId: string) {
    if (!eventId || !userId) {
      throw new Error("EventId and UserId are required")
    }

    return prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
      })

      if (!event) {
        throw new Error("Event not found")
      }

      if (!event.isActive) {
        throw new Error("Event is inactive")
      }

      const registration = await tx.eventRegistration.findUnique({
        where: {
          eventId_userId: {
            eventId,
            userId,
          },
        },
      })

      if (!registration) {
        throw new Error("Registration not found for this event")
      }

      if (registration.status !== "CONFIRMED") {
        throw new Error("Only confirmed registrations can check in")
      }

      if (registration.checkedIn) {
        throw new Error("User has already checked in")
      }

      return tx.eventRegistration.update({
        where: {
          eventId_userId: {
            eventId,
            userId,
          },
        },
        data: {
          checkedIn: true,
        },
      })
    })
  }

  /**
   * Fetch all event categories
   */
  static async getAllCategories() {
    return prisma.eventCategory.findMany({
      orderBy: { name: "asc" },
    })
  }

  /**
   * Create a new event category
   */
  static async createCategory(data: { name: string; description?: string }) {

    const name = data.name?.trim();

    if(!name) {
      throw new Error("Category name is required")
    }

    try {
      return await prisma.eventCategory.create({
        data: {
          name,
          description: data.description?.trim()
        }
      })
    } catch (error:any) {
     if (error.code === "P2002") {
      throw new Error(
        "Category name already exists"
      )
    }
    throw error
    }
  }

  /**
   * Update an event category details
   */
  static async updateCategory(
    id: string,
    data: { name?: string; description?: string }
  ) {
    const category = await prisma.eventCategory.findUnique({
      where: { id },
    })

    if (!category) {
      throw new Error("Category not found")
    }

    if (data.name && data.name !== category.name) {
      const existing = await prisma.eventCategory.findUnique({
        where: { name: data.name },
      })
      if (existing) {
        throw new Error("Category name already exists")
      }
    }

    try {
      return await prisma.eventCategory.update({
        where: { id },
        data,
      })
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Category name already exists")
      }
      throw error
    }
  }

  /**
   * Delete an event category
   */
  static async deleteCategory(id: string) {
    const category = await prisma.eventCategory.findUnique({
      where: { id },
    })

    if (!category) {
      throw new Error("Category not found")
    }

    return prisma.eventCategory.delete({
      where: { id },
    })
  }

  /**
   * Add a material to an event
   */
  static async addMaterial(
    eventId: string,
    data: { title: string; fileUrl: string; fileType: string }
  ) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      throw new Error("Event not found")
    }

    return prisma.eventMaterial.create({
      data: {
        title: data.title,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        eventId,
      },
    })
  }

  /**
   * Fetch all materials of an event
   */
  static async getMaterials(eventId: string) {
    return prisma.eventMaterial.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Delete a material from an event
   */
  static async deleteMaterial(eventId: string, materialId: string) {
    const material = await prisma.eventMaterial.findUnique({
      where: { id: materialId },
    })

    if (!material) {
      throw new Error("Material not found")
    }

    if (material.eventId !== eventId) {
      throw new Error("Material does not belong to this event")
    }

    return prisma.eventMaterial.delete({
      where: { id: materialId },
    })
  }

  /**
   * Fetch all registrations for an event with user profile details (Admin only)
   */
  static async getEventRegistrations(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true },
    })

    if (!event) {
      throw new Error("Event not found")
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return registrations.map((r) => ({
      id: r.id,
      eventId: r.eventId,
      userId: r.userId,
      status: r.status,
      checkedIn: r.checkedIn,
      registeredAt: r.createdAt,
      user: r.user,
    }))
  }

  /**
   * Fetch analytics metrics for a specific event
   */
  static async getEventAnalytics(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        maxCapacity: true,
      },
    })

    if (!event) {
      throw new Error("Event not found")
    }

    const [
      totalRegistrations,
      totalCheckedIn,
      confirmedCount,
      pendingCount,
      cancelledCount,
      totalMaterials,
    ] = await Promise.all([
      prisma.eventRegistration.count({ where: { eventId } }),
      prisma.eventRegistration.count({ where: { eventId, checkedIn: true } }),
      prisma.eventRegistration.count({
        where: { eventId, status: "CONFIRMED" },
      }),
      prisma.eventRegistration.count({ where: { eventId, status: "PENDING" } }),
      prisma.eventRegistration.count({
        where: { eventId, status: "CANCELLED" },
      }),
      prisma.eventMaterial.count({ where: { eventId } }),
    ])

    const attendanceRate =
      totalRegistrations > 0
        ? Number(((totalCheckedIn / totalRegistrations) * 100).toFixed(2))
        : 0

    const capacityUtilization =
      event.maxCapacity && event.maxCapacity > 0
        ? Number(((totalRegistrations / event.maxCapacity) * 100).toFixed(2))
        : 0

    return {
      eventId: event.id,
      title: event.title,
      maxCapacity: event.maxCapacity,
      totalRegistrations,
      totalCheckedIn,
      attendanceRate,
      capacityUtilization,
      statusBreakdown: {
        CONFIRMED: confirmedCount,
        PENDING: pendingCount,
        CANCELLED: cancelledCount,
      },
      totalMaterials,
    }
  }
}
