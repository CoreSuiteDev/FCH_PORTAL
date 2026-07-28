import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface BoardMeetingAttendee {
  id: string
  meetingId: string
  userId: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export interface MeetingRequest {
  id: string
  userId: string
  title: string
  reason: string
  date: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export interface BoardMeeting {
  id: string
  title: string
  description: string | null
  date: string
  duration: number
  meetingLink: string | null
  meetingType: "ONE_TO_ONE" | "ONE_TO_MANY"
  requestId: string | null
  createdAt: string
  updatedAt: string
  attendees: BoardMeetingAttendee[]
  request?: MeetingRequest | null
}

export const useMeetingsList = () => {
  return useQuery<BoardMeeting[]>({
    queryKey: ["board-meetings"],
    queryFn: () => api.get("/meetings").then((res) => res.data),
  })
}

export const useCreateMeeting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: {
      title: string
      description?: string
      date: string
      duration: number
      meetingLink?: string
      meetingType: "ONE_TO_ONE" | "ONE_TO_MANY"
      attendeeIds?: string[]
      requestId?: string
    }) => api.post("/meetings", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board-meetings"] })
      queryClient.invalidateQueries({ queryKey: ["meeting-requests"] })
    },
  })
}

export const useSubmitMeetingRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: { title: string; reason: string; date: string }) =>
      api.post("/meetings/requests", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting-requests"] })
    },
  })
}

export const useMeetingRequestsList = () => {
  return useQuery<MeetingRequest[]>({
    queryKey: ["meeting-requests", "all"],
    queryFn: () => api.get("/meetings/requests").then((res) => res.data),
  })
}

export const useMyMeetingRequests = () => {
  return useQuery<MeetingRequest[]>({
    queryKey: ["meeting-requests", "my"],
    queryFn: () => api.get("/meetings/requests/my").then((res) => res.data),
  })
}

export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MeetingRequest["status"] }) =>
      api.patch(`/meetings/requests/${id}/status`, { id, status }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting-requests"] })
    },
  })
}

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string
      title?: string
      description?: string
      date?: string
      duration?: number
      meetingLink?: string
      meetingType?: "ONE_TO_ONE" | "ONE_TO_MANY"
      attendeeIds?: string[]
    }) => api.patch(`/meetings/${id}`, { id, ...body }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board-meetings"] })
    },
  })
}
