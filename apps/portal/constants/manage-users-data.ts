// manage-data.ts

export interface UserMember {
  id: string
  name: string
  email: string
  tier: "General" | "Pastoral" | "Board"
  status: "Active" | "Expired" | "Canceled" | "Pending" | "Suspended"
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
    status: "Expired", // <-- Expired
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
  {
    id: "USR-2241",
    name: "David Kim",
    email: "d.kim@workspace.org",
    tier: "General",
    status: "Pending", // <-- Pending
    joinedDate: "June 07, 2026",
    amountPaid: "$0",
  },
  {
    id: "USR-8832",
    name: "Emma Watson",
    email: "emma.w@example.com",
    tier: "Pastoral",
    status: "Canceled", // <-- Canceled
    joinedDate: "January 12, 2026",
    amountPaid: "$0",
  },
  {
    id: "USR-4091",
    name: "Oliver Bennett",
    email: "o.bennett@demo.org",
    tier: "General",
    status: "Active",
    joinedDate: "May 20, 2026",
    amountPaid: "$50",
  },
  {
    id: "USR-6123",
    name: "Sophia Lin",
    email: "s.lin@workspace.org",
    tier: "Board",
    status: "Pending", // <-- Pending
    joinedDate: "June 06, 2026",
    amountPaid: "$0",
  },
  {
    id: "USR-7112",
    name: "James Wilson",
    email: "j.wilson@example.com",
    tier: "General",
    status: "Expired", // <-- Expired
    joinedDate: "February 14, 2026",
    amountPaid: "$50",
  },
  {
    id: "USR-3345",
    name: "Aisha Rahman",
    email: "a.rahman@workspace.org",
    tier: "Pastoral",
    status: "Active",
    joinedDate: "April 25, 2026",
    amountPaid: "$150",
  },
  {
    id: "USR-9910",
    name: "Liam O'Connor",
    email: "l.oconnor@demo.com",
    tier: "General",
    status: "Canceled", // <-- Canceled
    joinedDate: "March 05, 2026",
    amountPaid: "$0",
  },
  {
    id: "USR-5124",
    name: "Lucas Silva",
    email: "l.silva@example.org",
    tier: "General",
    status: "Active",
    joinedDate: "May 10, 2026",
    amountPaid: "$50",
  },
  {
    id: "USR-2045",
    name: "Chloe Dupont",
    email: "c.dupont@workspace.org",
    tier: "Board",
    status: "Active",
    joinedDate: "April 11, 2026",
    amountPaid: "$500",
  },
  {
    id: "USR-8761",
    name: "Amara Okafor",
    email: "a.okafor@example.com",
    tier: "Pastoral",
    status: "Pending", // <-- Pending
    joinedDate: "June 08, 2026",
    amountPaid: "$0",
  },
  {
    id: "USR-1432",
    name: "Yusuf Ahmed",
    email: "y.ahmed@demo.org",
    tier: "General",
    status: "Active",
    joinedDate: "May 02, 2026",
    amountPaid: "$50",
  },
  {
    id: "USR-6678",
    name: "Isabella Rossi",
    email: "i.rossi@example.com",
    tier: "Pastoral",
    status: "Expired", // <-- Expired
    joinedDate: "December 20, 2025",
    amountPaid: "$150",
  },
  {
    id: "USR-7239",
    name: "Alexander Wright",
    email: "a.wright@workspace.org",
    tier: "Board",
    status: "Canceled", // <-- Canceled
    joinedDate: "February 28, 2026",
    amountPaid: "$0",
  },
  {
    id: "USR-5012",
    name: "Mia Tanaka",
    email: "m.tanaka@demo.com",
    tier: "General",
    status: "Active",
    joinedDate: "May 18, 2026",
    amountPaid: "$50",
  },
]

export const tierSummaries: TierSummary[] = [
  { name: "General Tier", count: 10, percentage: 50.0, color: "bg-primary" },
  {
    name: "Pastoral Tier",
    count: 6,
    percentage: 30.0,
    color: "bg-emerald-500",
  },
  { name: "Board Members", count: 4, percentage: 20.0, color: "bg-indigo-500" },
]
