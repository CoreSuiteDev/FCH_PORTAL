interface SponsorData {
  id: string
  userName: string
  email: string
  role: string
  sponsorship: string
  amount: number
  date: string
  status: string
}
export const sponsorData: SponsorData[] = [
  {
    id: "101",
    userName: "John Doe",
    email: "john@example.com",
    role: "General",
    sponsorship: "Diamond",
    amount: 3000,
    date: "2026-06-01",
    status: "Success",
  },
  {
    id: "102",
    userName: "Jane Smith",
    email: "jane@example.com",
    role: "Pastoral",
    sponsorship: "Platinum",
    amount: 2500,
    date: "2026-06-05",
    status: "Success",
  },
  {
    id: "103",
    userName: "Bob Brown",
    email: "bob@example.com",
    role: "Board",
    sponsorship: "Gold",
    amount: 2000,
    date: "2026-06-10",
    status: "Pending",
  },
  {
    id: "104",
    userName: "Alice White",
    email: "alice@example.com",
    role: "General",
    sponsorship: "Silver",
    amount: 1000,
    date: "2026-06-12",
    status: "Success",
  },
  {
    id: "105",
    userName: "Charlie Day",
    email: "charlie@example.com",
    role: "Pastoral",
    sponsorship: "Bronze",
    amount: 500,
    date: "2026-06-13",
    status: "Success",
  },
  {
    id: "106",
    userName: "Eve Black",
    email: "eve@example.com",
    role: "Board",
    sponsorship: "Diamond",
    amount: 3000,
    date: "2026-06-14",
    status: "Success",
  },
  {
    id: "107",
    userName: "Frank Wright",
    email: "frank@example.com",
    role: "General",
    sponsorship: "Platinum",
    amount: 2500,
    date: "2026-06-15",
    status: "Pending",
  },
  {
    id: "108",
    userName: "Grace Hall",
    email: "grace@example.com",
    role: "Pastoral",
    sponsorship: "Gold",
    amount: 2000,
    date: "2026-06-16",
    status: "Success",
  },
  {
    id: "109",
    userName: "Hank Hill",
    email: "hank@example.com",
    role: "Board",
    sponsorship: "Silver",
    amount: 1000,
    date: "2026-06-17",
    status: "Success",
  },
  {
    id: "110",
    userName: "Ivy Ion",
    email: "ivy@example.com",
    role: "General",
    sponsorship: "Bronze",
    amount: 500,
    date: "2026-06-18",
    status: "Pending",
  },
  {
    id: "111",
    userName: "Jack Ryan",
    email: "jack@example.com",
    role: "Board",
    sponsorship: "Diamond",
    amount: 3000,
    date: "2026-06-19",
    status: "Success",
  },
  {
    id: "112",
    userName: "Kelly King",
    email: "kelly@example.com",
    role: "Pastoral",
    sponsorship: "Platinum",
    amount: 2500,
    date: "2026-06-20",
    status: "Success",
  },
  {
    id: "113",
    userName: "Leo Messi",
    email: "leo@example.com",
    role: "General",
    sponsorship: "Gold",
    amount: 2000,
    date: "2026-06-21",
    status: "Pending",
  },
  {
    id: "114",
    userName: "Mia Khalifa",
    email: "mia@example.com",
    role: "Board",
    sponsorship: "Silver",
    amount: 1000,
    date: "2026-06-22",
    status: "Success",
  },
  {
    id: "115",
    userName: "Noah Noah",
    email: "noah@example.com",
    role: "Pastoral",
    sponsorship: "Bronze",
    amount: 500,
    date: "2026-06-23",
    status: "Success",
  },
]

interface SponsorShipData {
  data: string[]
}

export const sponsorships: SponsorShipData = {
  data: ["All", "Diamond", "Platinum", "Gold", "Silver", "Bronze"],
}

interface SponsorPackages {
  title: string
  total: string
  yearly: string
  monthly: string
  color: string
  light: string
}

export const sponsorPackages: SponsorPackages[] = [
  {
    title: "DIAMOND",
    total: "$36k",
    yearly: "$9k",
    monthly: "$750",
    color: "text-red-600",
    light: "text-red-500",
  },
  {
    title: "PLATINUM",
    total: "$60k",
    yearly: "$15k",
    monthly: "$1.2k",
    color: "text-slate-900",
    light: "text-slate-600",
  },
  {
    title: "GOLD",
    total: "$90k",
    yearly: "$20k",
    monthly: "$1.6k",
    color: "text-amber-600",
    light: "text-amber-500",
  },
  {
    title: "SILVER",
    total: "$31k",
    yearly: "$7k",
    monthly: "$600",
    color: "text-blue-600",
    light: "text-blue-500",
  },
  {
    title: "BRONZE",
    total: "$12k",
    yearly: "$3k",
    monthly: "$250",
    color: "text-orange-600",
    light: "text-orange-500",
  },
]

interface TOTALSUMMARY {
  title: string
  mainValue: string
  lifetime: string
  yearly: string
  monthly: string
}

export const totalSummary: TOTALSUMMARY = {
  title: "TOTAL SPONSORSHIP REVENUE",
  mainValue: "$229k",
  lifetime: "$229k",
  yearly: "$54k",
  monthly: "$4.3k",
}
