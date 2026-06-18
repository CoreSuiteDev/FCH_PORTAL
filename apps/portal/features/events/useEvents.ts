import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "@workspace/ui/components/sonner"
import { eventApi } from "./events.api"
import { queryClient } from "@/lib/query-client"

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: eventApi.getEvents,
    staleTime: 5 * 1000 * 60,
  })
}

export const useEventMutation = () => {
  return useMutation({
    mutationFn: eventApi.createEvents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
      toast.success("Event created successfully")
    },
    onError: () => {
      toast.error("Something went wrong")
    },
  })
}
