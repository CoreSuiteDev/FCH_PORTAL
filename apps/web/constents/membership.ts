import { PackageMetadata, PackageTier } from "@/store/use-membership-store"

// Centralizing Content Data Models Alada Bhabe
export const MEMBERSHIP_REGISTRY: Record<PackageTier, PackageMetadata> = {
  general: {
    id: "general",
    title: "General Area",
    price: 19,
    billingPeriod: "per month",
    description:
      "Access to fundamental community tools, standard content updates, and basic network webinars.",
    features: [
      "Dashboard Home access",
      "Announcements Feed",
      "Member Events Calendar",
      "Standard Webinars Access",
    ],
  },
  pastoral: {
    id: "pastoral",
    title: "Pastoral Resources",
    price: 49,
    billingPeriod: "per month",
    description:
      "Advanced toolkits explicitly engineered for comprehensive parish administration, catechetical teaching, and regional leadership.",
    features: [
      "Everything in General Area",
      "Learning Library & Catechetical Tools",
      "Pastoral Leadership & Ministry Toolkits",
      "Parish & Diocese Shared Resources",
      "Advanced Webinars & Special Content",
    ],
  },
  board: {
    id: "board",
    title: "Board Room",
    price: 99,
    billingPeriod: "per month",
    description:
      "Enterprise oversight tier for executive management profiles. Contains corporate tools, deep internal planning components, and audit frameworks.",
    features: [
      "Everything in Pastoral Area",
      "Board Room Home & Executive Meetings Tracker",
      "Governance Docs & Financial Audits Engine",
      "Committees Management Systems",
      "Internal Strategic Planning modules",
      "Exclusive Collaboration Toolkits",
    ],
  },
}
