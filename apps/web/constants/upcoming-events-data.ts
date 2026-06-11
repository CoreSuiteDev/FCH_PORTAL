interface Event {
  id: number
  date: string
  title: string
  description: string
  location: string
  image: string
}

export const events: Event[] = [
  {
    id: 1,
    date: "November 15, 2025",
    title: "USCCB JUBILEE CELEBRATION",
    description:
      "Join us for a national gathering celebrating Hispanic catechetical.",
    location: "Washington, D.C",
    image: "/assets/upcoming-event.jpg",
  },
  {
    id: 2,
    date: "November 15, 2025",
    title: "USCCB JUBILEE CELEBRATION",
    description:
      "Join us for a national gathering celebrating Hispanic catechetical.",
    location: "Washington, D.C",
    image: "/assets/upcoming-event.jpg",
  },
]
