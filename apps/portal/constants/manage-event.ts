export type ClearanceLevel = "General" | "Pastoral" | "Board"
export type EventStatus = "Upcoming" | "Published" | "Ended"

export interface EventItem {
  id: string
  name: string
  date: string
  status: EventStatus
  attendees: number
  minClearance: ClearanceLevel
  description: string
  registeredMembers: string[]
}

export const EVENTS: EventItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Event ${i + 1}: ${["Seminar", "Workshop", "Meeting", "Conference"][i % 4]}`,
  date: `2026-06-${(i % 28) + 1}`,
  status: ["Upcoming", "Published", "Ended"][i % 3] as EventStatus,
  attendees: Math.floor(Math.random() * 100),
  minClearance: ["General", "Pastoral", "Board"][i % 3] as ClearanceLevel,
  description: `This is a detailed description for event number ${i + 1}.`,
  registeredMembers: ["John", "Sarah", "Mike", "Anna"].slice(0, (i % 4) + 1),
}))
