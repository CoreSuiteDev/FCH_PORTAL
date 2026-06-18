import { EventData } from "@/constants/event-data"
import { API_BASE_URL } from "./api-client"

export const getEvents = async () => {
  const { data } = await API_BASE_URL.get("/events")
  return data
}

export const createEvent = async (eventData: EventData) => {
  const { data } = await API_BASE_URL.post("/events", eventData)
  return data
}
