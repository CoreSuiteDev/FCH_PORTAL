export interface Webinar {
  id: string
  title: string
  speaker: string
  category: string
  status: "Upcoming" | "Live" | "Recorded"
  date: string
  startTime: string
  endTime: string
  description: string
  image: string
}

export const webinars: Webinar[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Webinar Session ${i + 1}`,
  speaker: i % 2 === 0 ? "Dr. John Doe" : "Maria Garcia",
  category: i % 3 === 0 ? "Catechesis" : "Hispanic Ministry",
  status: i % 3 === 0 ? "Live" : i % 2 === 0 ? "Upcoming" : "Recorded",
  date: "2026-06-25",
  startTime: "10:00 AM",
  endTime: "11:30 AM",
  description:
    "This is a professional session covering deep insights into modern ministry and community leadership strategies for the upcoming year.",
  image: `https://picsum.photos/seed/${i}/400/200`,
}))
