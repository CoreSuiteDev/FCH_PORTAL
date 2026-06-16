export type UserRole = "General" | "Pastoral" | "Board"

export interface MockData {
  id: string
  userName: string
  email: string
  role: string
  amount: number
  date: string
  status: string
}

export const mockData: MockData[] = [
  {
    id: "101",
    userName: "John Doe",
    email: "john@example.com",
    role: "general",
    amount: 150,
    date: "2026-06-15",
    status: "Success",
  },
  {
    id: "102",
    userName: "Jane Smith",
    email: "jane@example.com",
    role: "pastoral",
    amount: 200,
    date: "2026-06-14",
    status: "Pending",
  },
  {
    id: "103",
    userName: "Alice Brown",
    email: "alice@example.com",
    role: "board",
    amount: 500,
    date: "2026-06-13",
    status: "Success",
  },
  {
    id: "104",
    userName: "Bob Wilson",
    email: "bob@example.com",
    role: "general",
    amount: 120,
    date: "2026-06-12",
    status: "Success",
  },
  {
    id: "105",
    userName: "Charlie Day",
    email: "charlie@example.com",
    role: "pastoral",
    amount: 300,
    date: "2026-06-11",
    status: "Pending",
  },
  {
    id: "106",
    userName: "David Lee",
    email: "david@example.com",
    role: "board",
    amount: 450,
    date: "2026-06-10",
    status: "Success",
  },
  {
    id: "107",
    userName: "Eve White",
    email: "eve@example.com",
    role: "general",
    amount: 100,
    date: "2026-06-09",
    status: "Success",
  },
  {
    id: "108",
    userName: "Frank Miller",
    email: "frank@example.com",
    role: "pastoral",
    amount: 250,
    date: "2026-06-08",
    status: "Success",
  },
  {
    id: "109",
    userName: "Grace Hall",
    email: "grace@example.com",
    role: "board",
    amount: 600,
    date: "2026-06-07",
    status: "Pending",
  },
  {
    id: "110",
    userName: "Hank Green",
    email: "hank@example.com",
    role: "general",
    amount: 180,
    date: "2026-06-06",
    status: "Success",
  },
  {
    id: "111",
    userName: "Ivy Scott",
    email: "ivy@example.com",
    role: "pastoral",
    amount: 220,
    date: "2026-06-05",
    status: "Success",
  },
  {
    id: "112",
    userName: "Jack King",
    email: "jack@example.com",
    role: "board",
    amount: 700,
    date: "2026-06-04",
    status: "Success",
  },
  {
    id: "113",
    userName: "Kelly Moss",
    email: "kelly@example.com",
    role: "general",
    amount: 90,
    date: "2026-06-03",
    status: "Pending",
  },
  {
    id: "114",
    userName: "Leo King",
    email: "leo@example.com",
    role: "pastoral",
    amount: 350,
    date: "2026-06-02",
    status: "Success",
  },
  {
    id: "115",
    userName: "Mia Yang",
    email: "mia@example.com",
    role: "board",
    amount: 400,
    date: "2026-06-01",
    status: "Success",
  },
]
