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
  {
    id: "BRD-005",
    name: "Marcus Aurelius",
    role: "Compliance Officer",
    mfaStatus: "Enabled",
    lastActive: "3 days ago",
    clearanceLevel: "General",
  },
  {
    id: "BRD-006",
    name: "Sarah Jenkins",
    role: "Operations Lead",
    mfaStatus: "Enabled",
    lastActive: "Just Now",
    clearanceLevel: "Board",
  },
  {
    id: "BRD-007",
    name: "David Kim",
    role: "Security Architect",
    mfaStatus: "Disabled",
    lastActive: "Yesterday",
    clearanceLevel: "Pastoral",
  },
  {
    id: "BRD-008",
    name: "Emma Watson",
    role: "Legal Counsel",
    mfaStatus: "Enabled",
    lastActive: "5 hours ago",
    clearanceLevel: "General",
  },
  {
    id: "BRD-009",
    name: "Niko Bellic",
    role: "Logistics Manager",
    mfaStatus: "Enabled",
    lastActive: "4 days ago",
    clearanceLevel: "General",
  },
  {
    id: "BRD-010",
    name: "Clara Oswald",
    role: "Data Protection Officer",
    mfaStatus: "Enabled",
    lastActive: "12 mins ago",
    clearanceLevel: "Board",
  },
  {
    id: "BRD-011",
    name: "Bruce Wayne",
    role: "Risk Assessor",
    mfaStatus: "Disabled",
    lastActive: "Yesterday",
    clearanceLevel: "Board",
  },
  {
    id: "BRD-012",
    name: "Diana Prince",
    role: "External Auditor",
    mfaStatus: "Enabled",
    lastActive: "Just Now",
    clearanceLevel: "Pastoral",
  },
  {
    id: "BRD-013",
    name: "Diana Prince",
    role: "External Auditor",
    mfaStatus: "Enabled",
    lastActive: "Just Now",
    clearanceLevel: "Pastoral",
  },
  {
    id: "BRD-014",
    name: "Diana Prince",
    role: "External Auditor",
    mfaStatus: "Enabled",
    lastActive: "Just Now",
    clearanceLevel: "Pastoral",
  },
]
