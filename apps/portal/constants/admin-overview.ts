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
export interface FormSubmission {
  id: number
  type: string
  sender: string
  time: string
}
export interface Task {
  id: number
  title: string
  priority: "High" | "Medium" | "Low"
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
]

export const recentFormSubmissions: FormSubmission[] = [
  { id: 1, type: "Contact Form", sender: "John Doe", time: "2h ago" },
  {
    id: 2,
    type: "Webinar Registration",
    sender: "Sarah Smith",
    time: "5h ago",
  },
  { id: 3, type: "Newsletter Sign-up", sender: "User_882", time: "1d ago" },
]

export const pendingTasks: Task[] = [
  { id: 1, title: "Review New Member Application", priority: "High" },
  { id: 2, title: "Approve Refund Request #4402", priority: "Medium" },
  { id: 3, title: "Update Subscription Tiers", priority: "Low" },
]
