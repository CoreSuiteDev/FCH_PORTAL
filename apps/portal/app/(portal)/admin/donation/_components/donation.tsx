"use client"

import React, { useMemo, useState } from "react"
import { useDonationStore } from "@/store/use-donation-store"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Button } from "@workspace/ui/components/button"
import { DonationFilter } from "./filter-donation"
import { mockData } from "@/constants/donation"

export const Donation = () => {
  const { searchQuery, selectedTier, selectedDate, minAmount, maxAmount } =
    useDonationStore()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredData = useMemo(() => {
    return mockData.filter((d) => {
      const matchesSearch =
        d.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTier =
        selectedTier === "All" ||
        d.role.toLowerCase() === selectedTier.toLowerCase()
      const matchesMin = minAmount === "" || d.amount >= Number(minAmount)
      const matchesMax = maxAmount === "" || d.amount <= Number(maxAmount)
      const matchesDate =
        !selectedDate ||
        new Date(d.date).toDateString() === selectedDate.toDateString()

      return (
        matchesSearch && matchesTier && matchesMin && matchesMax && matchesDate
      )
    })
  }, [searchQuery, selectedTier, selectedDate, minAmount, maxAmount])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusStyle = (status: string) => {
    return status === "Success" ? "text-emerald-600" : "text-orange-500"
  }

  const getTierBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case "general":
        return "bg-sky-50 text-sky-600 border-sky-200"
      case "board":
        return "bg-purple-50 text-purple-600 border-purple-200"
      case "pastoral":
        return "bg-emerald-50 text-emerald-600 border-emerald-200"
      default:
        return "bg-slate-50 text-slate-600 border-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manage Payments</h1>
        <p className="text-slate-500">
          Monitor dues capture, review status, and filter transaction records.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {["General Tier Dues", "Pastoral Tier Dues", "Board Members Dues"].map(
          (tier, i) => (
            <Card key={i} className="border-slate-200 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {tier}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">$100</div>
                <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
                  <div className="h-full w-[30%] rounded-full bg-red-500" />
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <div className="mb-6">
        <DonationFilter />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6 pb-0">
          <h2 className="text-lg font-semibold">System Payments Directory</h2>
          <p className="mb-4 text-sm text-slate-500">
            Showing {filteredData.length} records
          </p>
        </div>
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead>PAYMENT ID</TableHead>
              <TableHead>CUSTOMER</TableHead>
              <TableHead>ASSIGNED TIER</TableHead>
              <TableHead>DUES CAPTURED</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((d) => (
              <TableRow key={d.id} className="border-b border-slate-100">
                <TableCell className="font-mono text-slate-500">
                  PAY-{d.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{d.userName}</div>
                  <div className="text-xs text-slate-500">{d.email}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getTierBadgeStyle(d.role)}`}
                  >
                    {d.role}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  ${d.amount}
                </TableCell>
                <TableCell className="text-slate-600">{d.date}</TableCell>
                <TableCell>
                  <div
                    className={`flex items-center gap-2 font-medium ${getStatusStyle(d.status)}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {d.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
