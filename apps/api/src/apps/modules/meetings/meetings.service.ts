import { prisma } from "../../../infrastructure/database/prisma.js"
import { MeetingType, MeetingRequestStatus } from "../../../generated/prisma/client.js"

export class MeetingsService {
  /**
   * Fetch scheduled board meetings
   */
  static async listMeetings(params: { userId: string; userRole: string | undefined }) {
    const isUserAdmin = params.userRole === "SUPER_ADMIN" || params.userRole === "ADMIN"

    // If admin, they see all meetings. If board member, they see meetings they are attendee of or type ONE_TO_MANY
    const where: any = isUserAdmin
      ? {}
      : {
          OR: [
            { meetingType: "ONE_TO_MANY" },
            {
              attendees: {
                some: {
                  userId: params.userId,
                },
              },
            },
          ],
        }

    return prisma.boardMeeting.findMany({
      where,
      include: {
        attendees: {
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
        },
        request: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { date: "asc" },
    })
  }

  /**
   * Create a new board meeting
   */
  static async createMeeting(data: {
    title: string
    description?: string
    date: Date
    duration: number
    meetingLink?: string
    meetingType: MeetingType
    attendeeIds?: string[]
    requestId?: string
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create the board meeting
      const meeting = await tx.boardMeeting.create({
        data: {
          title: data.title,
          description: data.description,
          date: data.date,
          duration: data.duration,
          meetingLink: data.meetingLink,
          meetingType: data.meetingType,
          requestId: data.requestId,
        },
      })

      // 2. Add attendees if provided
      if (data.attendeeIds && data.attendeeIds.length > 0) {
        await tx.boardMeetingAttendee.createMany({
          data: data.attendeeIds.map((userId) => ({
            meetingId: meeting.id,
            userId,
          })),
        })
      } else if (data.meetingType === "ONE_TO_MANY") {
        // Automatically add all Board members as attendees
        const boardMembers = await tx.user.findMany({
          where: {
            userRoles: {
              some: {
                role: {
                  name: "BOARD",
                },
              },
            },
          },
          select: { id: true },
        })

        if (boardMembers.length > 0) {
          await tx.boardMeetingAttendee.createMany({
            data: boardMembers.map((bm) => ({
              meetingId: meeting.id,
              userId: bm.id,
            })),
          })
        }
      }

      // 3. Update the request status to APPROVED if linked
      if (data.requestId) {
        await tx.meetingRequest.update({
          where: { id: data.requestId },
          data: { status: "APPROVED" },
        })
      }

      return meeting
    })
  }

  /**
   * Submit a meeting request
   */
  static async submitRequest(data: {
    userId: string
    title: string
    reason: string
    date: Date
  }) {
    return prisma.meetingRequest.create({
      data: {
        userId: data.userId,
        title: data.title,
        reason: data.reason,
        date: data.date,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  /**
   * List all meeting requests (Admin/Super Admin only)
   */
  static async listRequests() {
    return prisma.meetingRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Fetch requests submitted by a specific user (Board member)
   */
  static async myRequests(userId: string) {
    return prisma.meetingRequest.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Update a meeting request status (Super Admin only)
   */
  static async updateRequestStatus(id: string, status: MeetingRequestStatus) {
    return prisma.meetingRequest.update({
      where: { id },
      data: { status },
    })
  }
}
