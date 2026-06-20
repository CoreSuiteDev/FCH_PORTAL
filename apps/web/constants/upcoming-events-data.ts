export type EventStatus = "Upcoming" | "Ongoing" | "Ended"

export interface RegistryEvent {
  id: number
  date: string
  time: string
  title: string
  description: string
  status: EventStatus
  location: string
  capacity: number
  image: string
}

export const events: RegistryEvent[] = [
  // Upcoming
  {
    id: 1,
    date: "July 15, 2026",
    time: "10:00 AM",
    title: "Catechetical Sunday 2026",
    description:
      "The United States Conference of Catholic Bishops designated the third Sunday in September as Catechetical Sunday.",
    location: "Community Center",
    status: "Upcoming",
    capacity: 50,
    image: "/assets/feature-event.png",
  },
  {
    id: 2,
    date: "July 20, 2026",
    time: "11:00 AM",
    title: "Design Sprint",
    description: "UI/UX focused.",
    location: "Creative Lab",
    status: "Upcoming",
    capacity: 20,
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
  },
  {
    id: 3,
    date: "July 25, 2026",
    time: "09:00 AM",
    title: "Startup Pitch",
    description: "Business ideas.",
    location: "Main Hall",
    status: "Upcoming",
    capacity: 100,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },

  // Ongoing
  {
    id: 4,
    date: "June 13, 2026",
    time: "02:00 PM",
    title: "Tech Workshop",
    description: "Hands-on coding.",
    location: "Tech Hub",
    status: "Ongoing",
    capacity: 30,
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
  },
  {
    id: 5,
    date: "June 13, 2026",
    time: "01:00 PM",
    title: "Summer Hackathon",
    description: "Coding marathon.",
    location: "Open Space",
    status: "Ongoing",
    capacity: 60,
    image:
      "https://images.unsplash.com/photo-15043847645b6-bb21e7d89053?w=800&q=80",
  },
  {
    id: 6,
    date: "June 13, 2026",
    time: "10:00 AM",
    title: "Art Exhibition",
    description: "Local artists.",
    location: "Gallery A",
    status: "Ongoing",
    capacity: 40,
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
  },

  // Ended
  {
    id: 7,
    date: "June 01, 2026",
    time: "09:00 AM",
    title: "Leadership Forum",
    description: "Yearly decisions.",
    location: "Main Hall",
    status: "Ended",
    capacity: 100,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  },
  {
    id: 8,
    date: "May 20, 2026",
    time: "10:00 AM",
    title: "Health Seminar",
    description: "Wellness talk.",
    location: "Health Center",
    status: "Ended",
    capacity: 80,
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c5ad?w=800&q=80",
  },
  {
    id: 9,
    date: "May 10, 2026",
    time: "02:00 PM",
    title: "Book Reading",
    description: "Authors panel.",
    location: "Library",
    status: "Ended",
    capacity: 30,
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80",
  },
]
