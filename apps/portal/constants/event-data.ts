export type ClearanceLevel = "General" | "Pastoral" | "Board"
export type EventStatus = "Upcoming" | "Published" | "Ended"

export interface Attendee {
  id: string
  name: string
  email: string
  paymentAmount: number
}

export interface EventItem {
  id: string
  name: string
  imageUrl: string
  date: string
  time: string
  location: string
  description: string
  speaker: string
  registrationLink: string
  capacity: number
  status: EventStatus
  minClearance: ClearanceLevel
  attendees: number
  registeredMembers: Attendee[]
  category: string
}

export const EVENTS: EventItem[] = [
  {
    id: "1",
    name: "Annual Leadership Conference",
    imageUrl: "assets/event-1.jpg",
    date: "July 15, 2026",
    time: "10:00 AM",
    location: "Grand Ballroom",
    description:
      "A deep dive into strategic leadership for board members and staff.",
    speaker: "Dr. Ahmed Rahman",
    registrationLink: "/register/leadership-2026",
    capacity: 100,
    status: "Published",
    minClearance: "Board",
    attendees: 85,
    registeredMembers: [
      {
        id: "u1",
        name: "Rahim Uddin",
        email: "rahim@example.com",
        paymentAmount: 500,
      },
      {
        id: "u2",
        name: "Karim Khan",
        email: "karim@example.com",
        paymentAmount: 500,
      },
      {
        id: "u3",
        name: "Sara Ahmed",
        email: "sara@example.com",
        paymentAmount: 750,
      },
      {
        id: "u4",
        name: "Jasim Uddin",
        email: "jasim@example.com",
        paymentAmount: 500,
      },
      {
        id: "u5",
        name: "Fatima Begum",
        email: "fatima@example.com",
        paymentAmount: 1000,
      },
      {
        id: "u6",
        name: "Abul Kashem",
        email: "abul@example.com",
        paymentAmount: 500,
      },
      {
        id: "u7",
        name: "Nusrat Jahan",
        email: "nusrat@example.com",
        paymentAmount: 750,
      },
      {
        id: "u8",
        name: "Mahmud Hasan",
        email: "mahmud@example.com",
        paymentAmount: 500,
      },
      {
        id: "u9",
        name: "Tania Akter",
        email: "tania@example.com",
        paymentAmount: 1000,
      },
      {
        id: "u10",
        name: "Rafiqul Islam",
        email: "rafiq@example.com",
        paymentAmount: 500,
      },
      {
        id: "u11",
        name: "Sumi Khatun",
        email: "sumi@example.com",
        paymentAmount: 750,
      },
      {
        id: "u12",
        name: "Anwar Hossain",
        email: "anwar@example.com",
        paymentAmount: 500,
      },
      {
        id: "u13",
        name: "Dilara Yesmin",
        email: "dilara@example.com",
        paymentAmount: 1000,
      },
      {
        id: "u14",
        name: "Kamrul Islam",
        email: "kamrul@example.com",
        paymentAmount: 500,
      },
      {
        id: "u15",
        name: "Sabrina Sultana",
        email: "sabrina@example.com",
        paymentAmount: 750,
      },
    ],
    category: "Conference",
  },
  {
    id: "2",
    name: "Community Outreach Workshop",
    imageUrl: "assets/event-1.jpg",
    date: "August 20, 2026",
    time: "02:00 PM",
    location: "Community Hall",
    description: "Hands-on training for community service volunteers.",
    speaker: "Jane Doe",
    registrationLink: "/register/outreach-2026",
    capacity: 50,
    status: "Upcoming",
    minClearance: "General",
    attendees: 30,
    registeredMembers: [
      {
        id: "u4",
        name: "John Smith",
        email: "john@example.com",
        paymentAmount: 200,
      },
    ],
    category: "Workshop",
  },
]

export interface EventData {
  title: string
  startDate: string
  location: string
  description: string
  endDate: string
  coverImage: string
  maxCapacity: number
  meetingLink: string
  visibility: string
  eventType: string
  speakers: string
  categoryIds: string[]
}
