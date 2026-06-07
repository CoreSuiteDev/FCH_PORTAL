// board-data.ts

export interface BoardMemberAccess {
  id: string
  name: string
  role: string
  mfaStatus: "Enabled" | "Disabled"
  lastActive: string
  clearanceLevel: "L3-Full-Admin" | "L2-Financial-Only" | "L1-Read-Only"
}

export interface PermissionScope {
  id: string
  module: string
  description: string
  totalGrants: number
  riskScore: "High" | "Medium" | "Low"
}

export interface SecurityMetric {
  label: string
  value: string
  percentage: number
}

export const boardMembersAccessData: BoardMemberAccess[] = [
  {
    id: "BRD-001",
    name: "Dr. Aris Thorne",
    role: "Strategic Advisor",
    mfaStatus: "Enabled",
    lastActive: "Just Now",
    clearanceLevel: "L3-Full-Admin",
  },
  {
    id: "BRD-002",
    name: "Dr. Maria Hernandez",
    role: "Managing Director",
    mfaStatus: "Enabled",
    lastActive: "14 mins ago",
    clearanceLevel: "L3-Full-Admin",
  },
  {
    id: "BRD-003",
    name: "Sister Juana Inés",
    role: "Honorary Trustee",
    mfaStatus: "Enabled",
    lastActive: "2 hours ago",
    clearanceLevel: "L1-Read-Only",
  },
  {
    id: "BRD-004",
    name: "Elena Rostova",
    role: "Financial Overseer",
    mfaStatus: "Disabled",
    lastActive: "Yesterday",
    clearanceLevel: "L2-Financial-Only",
  },
]

export const permissionScopesData: PermissionScope[] = [
  {
    id: "SCP-901",
    module: "Core Ledger & Banking",
    description: "Read/Write access to primary financial transaction streams.",
    totalGrants: 2,
    riskScore: "High",
  },
  {
    id: "SCP-902",
    module: "Automated Tier Provisioning",
    description:
      "Ability to bypass stripe webhooks and manually scale user states.",
    totalGrants: 3,
    riskScore: "High",
  },
  {
    id: "SCP-903",
    module: "Audit Log Clearances",
    description:
      "Permission to archive or review application runtime console outputs.",
    totalGrants: 1,
    riskScore: "Medium",
  },
  {
    id: "SCP-904",
    module: "General Member Metadata",
    description: "Access to view profiles, email registers, and basic logs.",
    totalGrants: 4,
    riskScore: "Low",
  },
]

export const boardSecurityMetrics: SecurityMetric[] = [
  { label: "MFA Enforcement Coverage", value: "75%", percentage: 75 },
  {
    label: "Cryptographic Key Rotation",
    value: "On Schedule",
    percentage: 100,
  },
  { label: "Privileged Access Compliance", value: "92%", percentage: 92 },
]
