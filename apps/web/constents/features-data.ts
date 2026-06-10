import {
  CalendarDays,
  Video,
  ScreenShare,
  Laptop,
  LucideIcon,
} from "lucide-react"

// Define the interface for the feature object
export interface WebinarFeature {
  id: number
  title: string
  description: string
  icon: LucideIcon // Correct type for Lucide icons
}

// Apply the interface to the array
export const webinarFeatures: WebinarFeature[] = [
  {
    id: 1,
    title: "EASY TO JOIN",
    description:
      "One-click access to all our live sessions and recorded archives, which will be helpful for you.",
    icon: CalendarDays,
  },
  {
    id: 2,
    title: "HIGH-QUALITY VIDEO",
    description:
      "Crisp video and audio ensures you never miss a word of the teaching.",
    icon: Video,
  },
  {
    id: 3,
    title: "SCREEN SHARING",
    description:
      "Collaborative tools for interactive group learning and discussions.",
    icon: ScreenShare,
  },
  {
    id: 4,
    title: "ALL DEVICES FRIENDLY",
    description:
      "Learn on the go with your phone, tablet, or desktop computer.",
    icon: Laptop,
  },
]
