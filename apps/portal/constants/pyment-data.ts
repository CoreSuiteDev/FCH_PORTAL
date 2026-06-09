export interface Payment {
  id: string
  customerName: string
  email: string
  amount: number
  status: "Success" | "Pending" | "Failed"
  date: string
  tier: "General" | "Pastoral" | "Board"
}

export const paymentData: Payment[] = [
  {
    id: "PAY-9021",
    customerName: "Marcus Vance",
    email: "m.vance@workspace.org",
    amount: 50,
    status: "Success",
    date: "2026-06-05",
    tier: "General",
  },
  {
    id: "PAY-4412",
    customerName: "Dr. Aris Thorne",
    email: "a.thorne@workspace.org",
    amount: 500,
    status: "Success",
    date: "2026-06-02",
    tier: "Board",
  },
  {
    id: "PAY-7834",
    customerName: "Elena Rostova",
    email: "e.rostova@example.com",
    amount: 150,
    status: "Success",
    date: "2026-05-29",
    tier: "Pastoral",
  },
  {
    id: "PAY-1122",
    customerName: "Amara Okoro",
    email: "a.okoro@workspace.org",
    amount: 50,
    status: "Pending",
    date: "2026-06-07",
    tier: "General",
  },
  {
    id: "PAY-3344",
    customerName: "Liam Johnson",
    email: "l.johnson@example.com",
    amount: 500,
    status: "Failed",
    date: "2026-06-01",
    tier: "Board",
  },
  {
    id: "PAY-5566",
    customerName: "Sophia Martinez",
    email: "s.martinez@workspace.org",
    amount: 150,
    status: "Success",
    date: "2026-05-25",
    tier: "Pastoral",
  },
]
