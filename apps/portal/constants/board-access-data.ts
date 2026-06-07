// @/constants/board-access-data.ts

export type AllowedClearance = "General" | "Pastoral" | "Board"

export interface BoardMemberAccess {
  id: string
  name: string
  role: string
  mfaStatus: "Enabled" | "Disabled"
  lastActive: string
  clearanceLevel: AllowedClearance
}

export const boardMembersAccessData: BoardMemberAccess[] = [
  {
    id: "BRD-001",
    name: "Dr. Aris Thorne",
    role: "Strategic Advisor",
    mfaStatus: "Enabled",
    lastActive: "Just Now",
    clearanceLevel: "Board",
  },
  {
    id: "BRD-002",
    name: "Dr. Maria Hernandez",
    role: "Managing Director",
    mfaStatus: "Enabled",
    lastActive: "14 mins ago",
    clearanceLevel: "Board",
  },
  {
    id: "BRD-003",
    name: "Sister Juana Inés",
    role: "Honorary Trustee",
    mfaStatus: "Enabled",
    lastActive: "2 hours ago",
    clearanceLevel: "General",
  },
  {
    id: "BRD-004",
    name: "Elena Rostova",
    role: "Financial Overseer",
    mfaStatus: "Disabled",
    lastActive: "Yesterday",
    clearanceLevel: "Pastoral",
  },
]
