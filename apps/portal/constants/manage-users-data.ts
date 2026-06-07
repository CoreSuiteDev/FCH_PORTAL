// manage-data.ts

export interface UserMember {
  id: string
  name: string
  email: string
  tier: "General" | "Pastoral" | "Board"
  status: "Active" | "Suspended"
  joinedDate: string
  amountPaid: string
}

export interface TierSummary {
  name: string
  count: number
  percentage: number
  color: string
}

export const userMembersData: UserMember[] = [
  {
    id: "USR-9021",
    name: "Marcus Vance",
    email: "m.vance@workspace.org",
    tier: "General",
    status: "Active",
    joinedDate: "June 05, 2026",
    amountPaid: "$50",
  },
  {
    id: "USR-4412",
    name: "Dr. Aris Thorne",
    email: "a.thorne@workspace.org",
    tier: "Board",
    status: "Active",
    joinedDate: "June 02, 2026",
    amountPaid: "$500",
  },
  {
    id: "USR-7834",
    name: "Elena Rostova",
    email: "e.rostova@example.com",
    tier: "Pastoral",
    status: "Active",
    joinedDate: "May 29, 2026",
    amountPaid: "$150",
  },
  {
    id: "USR-3110",
    name: "Carlos Mendoza",
    email: "carlos.m@example.com",
    tier: "Pastoral",
    status: "Active",
    joinedDate: "May 15, 2026",
    amountPaid: "$150",
  },
  {
    id: "USR-1092",
    name: "Sarah Jenkins",
    email: "s.jenkins@demo.com",
    tier: "General",
    status: "Suspended",
    joinedDate: "April 02, 2026",
    amountPaid: "$0",
  },
  {
    id: "USR-5561",
    name: "Dr. Maria Hernandez",
    email: "m.hernandez@example.com",
    tier: "Board",
    status: "Active",
    joinedDate: "March 18, 2026",
    amountPaid: "$500",
  },
]

export const tierSummaries: TierSummary[] = [
  { name: "General Tier", count: 145, percentage: 59.2, color: "bg-primary" },
  {
    name: "Pastoral Tier",
    count: 85,
    percentage: 34.7,
    color: "bg-emerald-500",
  },
  { name: "Board Members", count: 15, percentage: 6.1, color: "bg-indigo-500" },
]
