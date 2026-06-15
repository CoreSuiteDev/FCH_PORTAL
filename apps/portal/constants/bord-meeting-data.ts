export type UpcomingMeeting = {
  id: string
  title: string
  platform: string
  date: string
  time: string
  link: string
}
export const upcomingMeetings: UpcomingMeeting[] = [
  {
    id: "u1",
    title: "Q3 Board Strategy & Audit",
    platform: "Zoom",
    date: "2026-09-10",
    time: "10:00 AM",
    link: "https://zoom.us/j/123456",
  },
  {
    id: "u2",
    title: "Product Roadmap Review",
    platform: "Google Meet",
    date: "2026-09-12",
    time: "02:30 PM",
    link: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "u3",
    title: "Client Feedback Sync",
    platform: "Microsoft Teams",
    date: "2026-09-15",
    time: "11:00 AM",
    link: "https://teams.microsoft.com/l/meetup-join/123",
  },
  {
    id: "u4",
    title: "Quarterly Performance Review",
    platform: "Zoom",
    date: "2026-09-18",
    time: "03:00 PM",
    link: "https://zoom.us/j/987654",
  },
]
