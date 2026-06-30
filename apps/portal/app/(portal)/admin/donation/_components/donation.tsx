"use client"

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"

// UI Components
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

// Local Components
import { useDonationHistory } from "@/hooks/useDonation"
import DonationStats from "./donation-stats"
import { DonationFilter } from "./filter-donation"

import { ZTDonationHistoryItem } from "@workspace/types"
import Link from "next/link"

export const Donation = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const { data, isLoading, refetch, isFetching } = useDonationHistory(
    currentPage,
    itemsPerPage
  )
  const responseData = data
  console.log("data-------------------------------->", data)

  // Table Columns Definition
  const columnHelper = createColumnHelper<ZTDonationHistoryItem>()
  const columns = [
    columnHelper.accessor("id", {
      header: "PAYMENT ID",
      cell: (info) => (
        <span className="font-mono text-slate-500">
          PAY-{info.getValue().substring(0, 10)}
        </span>
      ),
    }),
    columnHelper.accessor("donator", {
      header: "DONATOR INFORMATION",
      cell: (info) => {
        const donator = info.getValue()
        const user = info.row.original.user
        const name = donator?.name || user?.name || "Guest"
        const email = donator?.email || user?.email || "No Email"
        const phone = donator?.phone || user?.phone || "No Phone"
        return (
          <>
            <div className="font-medium text-slate-900">{name}</div>
            <div className="text-xs text-slate-500">{email}</div>
            <div className="text-xs text-slate-500">{phone}</div>
          </>
        )
      },
    }),
    columnHelper.display({
      id: "role",
      header: "USER ROLE",
      cell: (info) => {
        const user = info.row.original.user
        const role = user?.role || "Guest"
        let style = "bg-slate-50 text-slate-600 border-slate-200"

        if (role.toLowerCase() === "general")
          style = "bg-sky-50 text-sky-600 border-sky-200"
        if (role.toLowerCase() === "board")
          style = "bg-purple-50 text-purple-600 border-purple-200"
        if (role.toLowerCase() === "pastoral")
          style = "bg-emerald-50 text-emerald-600 border-emerald-200"
        if (role.toLowerCase() === "admin")
          style = "bg-red-50 text-red-600 border-red-200"

        return (
          <Badge variant="outline" className={`capitalize ${style}`}>
            {role}
          </Badge>
        )
      },
    }),
    columnHelper.accessor("amount", {
      header: "PAYMENT AMOUNT",
      cell: (info) => (
        <span className="font-bold text-slate-900">
          {info.row.original.currency === "USD" ? "$ " : "€"}
          {info.getValue() || 0}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "DATE",
      cell: (info) => (
        <span className="text-slate-600">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "STATUS",
      cell: (info) => {
        const status = info.getValue()
        const isSuccess = status === "SUCCEEDED" || status === "Success"
        const statusStyle = isSuccess ? "text-emerald-600" : "text-orange-500"

        return (
          <div className={`flex items-center gap-2 font-medium ${statusStyle}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {status}
          </div>
        )
      },
    }),
    columnHelper.accessor("cardBrand", {
      header: "CARD BRAND",
      cell: (info) => {
        const cardBrand = info.getValue() || "N/A"
        return (
          <div className={`flex items-center gap-2 font-normal uppercase`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {cardBrand}
          </div>
        )
      },
    }),
    columnHelper.accessor("cardLast4", {
      header: "CARD LAST 4",
      cell: (info) => (
        <span className="font-medium text-slate-900">
          {info.getValue() || "N/A"}
        </span>
      ),
    }),
    columnHelper.accessor("stripeCustomerId", {
      header: "STRIPE CUSTOMER ID",
      cell: (info) => {
        const stripeCustomerId = info.getValue() || "N/A"
        return (
          <span className="font-medium text-slate-900">
            {stripeCustomerId.substring(0, 10)}
          </span>
        )
      },
    }),
    columnHelper.accessor("receiptUrl", {
      header: "RECEIPT URL",
      cell: (info) => {
        const receiptUrl = info.getValue() || "#"
        if (receiptUrl === "#") {
          return <span className="text-slate-600">No Receipt</span>
        }
        return (
          <Link
            href={receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:cursor-pointer hover:underline"
          >
            View Receipt
          </Link>
        )
      },
    }),
  ]

  // TanStack Table Instance
  const table = useReactTable({
    data: responseData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const totalRecords = responseData?.meta.totalCount || 0
  const totalPages = responseData?.meta.totalPages || 1

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Donation Payments</h1>
        <p className="text-slate-500">
          Monitor dues capture, review status, and filter transaction records.
        </p>
      </div>

      <DonationStats />

      <div className="mb-6">
        <DonationFilter />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6 pb-0">
          <h2 className="text-lg font-semibold">System Payments Directory</h2>
          <p className="mb-4 text-sm text-slate-500">
            Showing {totalRecords} records {isLoading && " (Loading...)"}
          </p>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-slate-100">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-slate-500"
                >
                  {isLoading ? "Fetching records..." : "No records found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Section */}
        <div className="flex items-center justify-between border-t p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={!responseData?.meta.hasPreviousPage || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={!responseData?.meta.hasNextPage || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
