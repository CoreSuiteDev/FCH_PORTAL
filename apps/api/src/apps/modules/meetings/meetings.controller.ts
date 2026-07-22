import { TRPCError } from "@trpc/server"
import { MeetingsService } from "./meetings.service.js"
import { MeetingType, MeetingRequestStatus } from "../../../generated/prisma/client.js"

export class MeetingsController {
  static async listMeetings(params: { userId: string; userRole: string | undefined }) {
    try {
      return await MeetingsService.listMeetings(params)
    } catch (err: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message || "Failed to fetch meetings list",
      })
    }
  }

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
    try {
      return await MeetingsService.createMeeting(data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to create meeting",
      })
    }
  }

  static async submitRequest(data: {
    userId: string
    title: string
    reason: string
    date: Date
  }) {
    try {
      return await MeetingsService.submitRequest(data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to submit meeting request",
      })
    }
  }

  static async listRequests() {
    try {
      return await MeetingsService.listRequests()
    } catch (err: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message || "Failed to list meeting requests",
      })
    }
  }

  static async myRequests(userId: string) {
    try {
      return await MeetingsService.myRequests(userId)
    } catch (err: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message || "Failed to list your meeting requests",
      })
    }
  }

  static async updateRequestStatus(id: string, status: MeetingRequestStatus) {
    try {
      return await MeetingsService.updateRequestStatus(id, status)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to update request status",
      })
    }
  }

  static async updateMeeting(data: {
    id: string
    title?: string
    description?: string
    date?: Date
    duration?: number
    meetingLink?: string
    meetingType?: MeetingType
    attendeeIds?: string[]
  }) {
    try {
      return await MeetingsService.updateMeeting(data)
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message || "Failed to update meeting",
      })
    }
  }
}
