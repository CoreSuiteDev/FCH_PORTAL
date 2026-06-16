"use client"

import React, { useMemo, useState } from "react"
import { Badge } from "@workspace/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Button } from "@workspace/ui/components/button"

import { useSponsorStore } from "@/store/use-sponsor-store"
import { SponsorFilter } from "./sopncer-filter"

const mockData = [
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
]

const getSponsorshipBadgeStyle = (tier: string) => {
  switch (tier) {
    case "Diamond":
      return "bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-200"
    case "Platinum":
      return "bg-slate-200 text-slate-700 hover:bg-slate-300 border-slate-300"
    case "Gold":
      return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"
    case "Silver":
      return "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"
    case "Bronze":
      return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200"
    default:
      return "bg-slate-100 text-slate-600"
  }
}

export default function Sponsor() {
  const {
    searchQuery,
    selectedTier,
    selectedSponsorship,
    selectedDate,
    minAmount,
    maxAmount,
  } = useSponsorStore()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredData = useMemo(() => {
    return mockData.filter((d) => {
      const matchesSearch =
        d.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTier = selectedTier === "All" || d.role === selectedTier
      const matchesSponsorship =
        selectedSponsorship === "All" || d.sponsorship === selectedSponsorship
      const matchesMin = minAmount === "" || d.amount >= Number(minAmount)
      const matchesMax = maxAmount === "" || d.amount <= Number(maxAmount)
      const matchesDate =
        !selectedDate ||
        new Date(d.date).toDateString() === selectedDate.toDateString()
      return (
        matchesSearch &&
        matchesTier &&
        matchesSponsorship &&
        matchesMin &&
        matchesMax &&
        matchesDate
      )
    })
  }, [
    searchQuery,
    selectedTier,
    selectedSponsorship,
    selectedDate,
    minAmount,
    maxAmount,
  ])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <SponsorFilter />
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>PAYMENT ID</TableHead>
              <TableHead>CUSTOMER</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>SPONSORSHIP</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-slate-500">
                  PAY-{d.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{d.userName}</div>
                  <div className="text-xs text-slate-400">{d.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{d.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-semibold ${getSponsorshipBadgeStyle(d.sponsorship)}`}
                  >
                    {d.sponsorship}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  ${d.amount}
                </TableCell>
                <TableCell
                  className={
                    d.status === "Success"
                      ? "text-emerald-600"
                      : "text-orange-500"
                  }
                >
                  • {d.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
