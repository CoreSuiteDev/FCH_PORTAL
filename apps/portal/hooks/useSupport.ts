import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  message: string
  status: "PENDING" | "OPEN" | "RESOLVED" | "CLOSED"
  adminNote: string | null
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export const useUserTickets = () => {
  return useQuery<SupportTicket[]>({
    queryKey: ["support-tickets", "my"],
    queryFn: () =>
      api.get("/support/tickets/my").then((res) => res.data),
  })
}

export const useCreateTicket = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: { subject: string; message: string }) =>
      api.post("/support/tickets", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] })
    },
  })
}

export const useAllTickets = (params: { page?: number; limit?: number; status?: string } = {}) => {
  return useQuery<{ data: SupportTicket[]; meta: any }>({
    queryKey: ["support-tickets", "all", params],
    queryFn: () =>
      api.get("/support/tickets/admin", { params }).then((res) => res.data),
  })
}

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      ticketId,
      status,
      adminNote,
      replyMessage,
    }: {
      ticketId: string
      status: SupportTicket["status"]
      adminNote?: string
      replyMessage?: string
    }) =>
      api.post(`/support/tickets/${ticketId}/process`, { status, adminNote, replyMessage }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] })
    },
  })
}
