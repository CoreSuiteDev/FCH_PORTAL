"use client"

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
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

import { Skeleton } from "@workspace/ui/components/skeleton"

// Local Components
import { useFilterDonations } from "@/hooks/useDonation"
import { ZTDonationHistoryItem } from "@workspace/types"
import DonationStats from "./donation-stats"
import { DonationFilter } from "./filter-donation"

export const Donation = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTier, setSelectedTier] = useState("All")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")

  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useFilterDonations({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    role: selectedTier === "All" ? undefined : selectedTier,
    minAmount: minAmount ? Number(minAmount) : undefined,
    maxAmount: maxAmount ? Number(maxAmount) : undefined,
    createdAt: selectedDate ? selectedDate.toISOString() : undefined,
  })

  // Table Columns Definition
  const columnHelper = createColumnHelper<ZTDonationHistoryItem>()
  const columns = [
    columnHelper.display({
      id: "sl",
      header: "SL",
      cell: (info) => (
        <span className="font-medium text-slate-900">
          {(currentPage - 1) * itemsPerPage + info.row.index + 1}
        </span>
      ),
    }),
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
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: responseData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const totalRecords = responseData?.meta?.totalCount || 0
  const totalPages = responseData?.meta?.totalPages || 1

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
        <DonationFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTier={selectedTier}
          setSelectedTier={setSelectedTier}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          minAmount={minAmount}
          setMinAmount={setMinAmount}
          maxAmount={maxAmount}
          setMaxAmount={setMaxAmount}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              System Payments Directory
              {/* Background fetching indicator */}
              {isFetching && !isLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              )}
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              Showing {totalRecords} records
            </p>
          </div>

          {/* Refresh Data Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
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
            {/* 1. INITIAL LOADING STATE */}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-slate-100">
                  <TableCell className="py-4"><Skeleton className="h-4 w-6" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </TableCell>
                  <TableCell className="py-4"><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-4 w-14" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-4 w-14" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : /* 2. ERROR STATE */
            isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-red-500">
                    <AlertCircle className="mb-4 h-8 w-8" />
                    <p className="font-medium">Failed to load data</p>
                    <p className="mb-4 text-sm text-red-400">
                      {error?.message || "An unexpected error occurred."}
                    </p>
                    <Button
                      onClick={() => refetch()}
                      variant="outline"
                      className="text-slate-700"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : /* 3. SUCCESS WITH DATA */
            table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`border-b border-slate-100 ${isFetching ? "opacity-60 transition-opacity" : ""}`}
                >
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
              /* 4. SUCCESS BUT EMPTY STATE */
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <p className="font-medium text-slate-900">
                      No records found
                    </p>
                    <p className="mt-1 text-sm">
                      There are no donations matching your criteria.
                    </p>
                  </div>
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
            disabled={
              !responseData?.meta?.hasPreviousPage || isLoading || isFetching
            }
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
            disabled={
              !responseData?.meta?.hasNextPage || isLoading || isFetching
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
