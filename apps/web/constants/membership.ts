import { PackageMetadata, PackageTier } from "@/store/use-membership-store"

export const MEMBERSHIP_REGISTRY: Record<PackageTier, PackageMetadata> = {
  general: {
    id: "general",
    title: "General Membership",
    subtitle:
      "Community access, member updates, events, and standard webinars.",
    price: 19,
    billingPeriod: "per month",
    description:
      "Designed for individuals who want to stay connected with the FCH network, participate in member events, receive important updates, and access standard webinars and community resources.",
    features: [
      "Member Dashboard access",
      "Newsletter and communication updates",
      "Member Events Calendar",
      "Access to standard FCH webinars",
      "Basic member resources",
    ],
  },

  pastoral: {
    id: "pastoral",
    title: "Pastoral Membership",
    subtitle:
      "Advanced formation, pastoral resources, ministry tools, and leadership support.",
    price: 49,
    billingPeriod: "per month",
    description:
      "Designed for catechetical leaders, parish teams, diocesan staff, ministry coordinators, educators, and organizations serving Hispanic Catholic communities.",
    features: [
      "Everything in General Membership",
      "Advanced webinar access",
      "Pastoral Resources Library",
      "Catechetical resources",
      "Parish and Diocese resources",
      "Access to general FCH documents and archives",
    ],
  },
}
