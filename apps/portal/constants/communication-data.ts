export interface UserMember {
  id: string
  name: string
  email: string
  tier: string
  status: string
}
export interface SupportTicket {
  id: string
  name: string
  email: string
  message: string
  date: string
}

export const CommunicationusersData: UserMember[] = Array.from(
  { length: 20 },
  (_, i) => ({
    id: `USR-${100 + i}`,
    name: `Member ${i + 1}`,
    email: `member${i + 1}@example.com`,
    tier: i % 3 === 0 ? "General" : i % 3 === 1 ? "Pastoral" : "Board",
    status:
      i % 4 === 0
        ? "Active"
        : i % 4 === 1
          ? "Pending"
          : i % 4 === 2
            ? "Expired"
            : "Canceled",
  })
)

export const supportData: SupportTicket[] = Array.from(
  { length: 20 },
  (_, i) => ({
    id: `S-${200 + i}`,
    name: `Client ${i + 1}`,
    email: `client${i + 1}@example.com`,
    message: `Support inquiry ${i + 1} regarding access issues.`,
    date: "2026-06-09",
  })
)
