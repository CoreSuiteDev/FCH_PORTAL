// data.ts

export interface MembershipTrend {
  month: string
  general: number
  pastoral: number
  board: number
}

export interface RecentBoardMember {
  id: number
  name: string
  email: string
  role: string
  joinedDate: string
}

export interface UserDistribution {
  tier: string
  percentage: number
  count: number
  color: string
}

export interface UpkeepMetric {
  id: number
  label: string
  value: string
  status: "good" | "warning" | "neutral"
}

export const membershipTrends: MembershipTrend[] = [
  { month: "Jan", general: 40, pastoral: 20, board: 5 },
  { month: "Feb", general: 55, pastoral: 28, board: 5 },
  { month: "Mar", general: 70, pastoral: 35, board: 8 },
  { month: "Apr", general: 85, pastoral: 50, board: 10 },
  { month: "May", general: 110, pastoral: 68, board: 12 },
  { month: "Jun", general: 145, pastoral: 85, board: 15 },
]

export const recentBoardMembers: RecentBoardMember[] = [
  {
    id: 1,
    name: "Dr. Aris Thorne",
    email: "a.thorne@workspace.org",
    role: "Strategic Advisor",
    joinedDate: "June 02, 2026",
  },
  {
    id: 2,
    name: "Sister Juana Inés",
    email: "juana.ines@example.com",
    role: "Honorary Trustee",
    joinedDate: "May 24, 2026",
  },
  {
    id: 3,
    name: "Dr. Maria Hernandez",
    email: "m.hernandez@example.com",
    role: "Managing Director",
    joinedDate: "April 18, 2026",
  },
  {
    id: 4,
    name: "Dr. Maria Hernandez",
    email: "m.hernandez@example.com",
    role: "Managing Director",
    joinedDate: "April 18, 2026",
  },
]

export const userDistributions: UserDistribution[] = [
  { tier: "General Tier", percentage: 59.2, count: 145, color: "bg-primary" },
  {
    tier: "Pastoral Tier",
    percentage: 34.7,
    count: 85,
    color: "bg-emerald-500",
  },
  { tier: "Board Members", percentage: 6.1, count: 15, color: "bg-indigo-500" },
]

export const platformUpkeepMetrics: UpkeepMetric[] = [
  { id: 1, label: "Automated Renewal Success", value: "98.4%", status: "good" },
  { id: 2, label: "Payment Gateway Health", value: "100%", status: "good" },
  { id: 3, label: "System Sync Latency", value: "45ms", status: "neutral" },
  { id: 4, label: "Pending Stripe Webhooks", value: "0", status: "good" },
]
