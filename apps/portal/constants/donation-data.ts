import { string } from "zod"
interface subItems {
  label: string
  value: string
}
interface Donation {
  title: string
  mainValue: string
  mainColor: string
  subItems: subItems[]
}

export const DonationData: Donation[] = [
  {
    title: "GENERAL TIER",
    mainValue: "$185k",
    mainColor: "text-blue-600",
    subItems: [
      { label: "LIFETIME", value: "$185k" },
      { label: "YEARLY", value: "$45k" },
      { label: "MONTHLY", value: "$4.2k" },
    ],
  },
  {
    title: "PASTORAL TIER",
    mainValue: "$48k",
    mainColor: "text-emerald-600",
    subItems: [
      { label: "LIFETIME", value: "$48k" },
      { label: "YEARLY", value: "$12k" },
      { label: "MONTHLY", value: "$1.1k" },
    ],
  },
  {
    title: "BOARD MEMBERS",
    mainValue: "$24k",
    mainColor: "text-purple-600",
    subItems: [
      { label: "LIFETIME", value: "$24k" },
      { label: "YEARLY", value: "$8k" },
      { label: "MONTHLY", value: "$2.0k" },
    ],
  },
]
