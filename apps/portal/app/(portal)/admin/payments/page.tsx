"use client"

import React, { useMemo } from "react"
import { usePaymentStore } from "@/store/use-pyment-store"
import { paymentData, Payment } from "@/constants/pyment-data"
import {
  Search,
  Calendar as CalendarIcon,
  Plus,
  DollarSign,
} from "lucide-react"

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Badge } from "@workspace/ui/components/badge"

export default function PaymentsPage() {
  // 1. Destructure filter inputs and handlers from the store
  const {
    searchQuery,
    selectedTier,
    selectedDate,
    minAmount,
    maxAmount,
    setSearchQuery,
    setSelectedTier,
    setSelectedDate,
    setMinAmount,
    setMaxAmount,
  } = usePaymentStore()

  // 2. Compute filtered data using standard React useMemo tracking the primitive store states
  const filteredData = useMemo(() => {
    return paymentData.filter((item) => {
      const matchesSearch =
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTier = selectedTier === "All" || item.tier === selectedTier

      let matchesDate = true
      if (selectedDate) {
        matchesDate =
          new Date(item.date).toDateString() === selectedDate.toDateString()
      }

      const matchesMinAmount =
        minAmount === "" || item.amount >= parseFloat(minAmount)
      const matchesMaxAmount =
        maxAmount === "" || item.amount <= parseFloat(maxAmount)

      return (
        matchesSearch &&
        matchesTier &&
        matchesDate &&
        matchesMinAmount &&
        matchesMaxAmount
      )
    })
  }, [searchQuery, selectedTier, selectedDate, minAmount, maxAmount])

  // 3. Compute stats based strictly on your freshly memoized filteredData array reference
  const stats = useMemo(() => {
    const totalGeneral = filteredData
      .filter((p) => p.tier === "General")
      .reduce((acc, p) => acc + p.amount, 0)
    const totalPastoral = filteredData
      .filter((p) => p.tier === "Pastoral")
      .reduce((acc, p) => acc + p.amount, 0)
    const totalBoard = filteredData
      .filter((p) => p.tier === "Board")
      .reduce((acc, p) => acc + p.amount, 0)
    const grandTotal = totalGeneral + totalPastoral + totalBoard

    return {
      general: {
        amount: totalGeneral,
        ratio: grandTotal
          ? ((totalGeneral / grandTotal) * 100).toFixed(1)
          : "0",
      },
      pastoral: {
        amount: totalPastoral,
        ratio: grandTotal
          ? ((totalPastoral / grandTotal) * 100).toFixed(1)
          : "0",
      },
      board: {
        amount: totalBoard,
        ratio: grandTotal ? ((totalBoard / grandTotal) * 100).toFixed(1) : "0",
      },
    }
  }, [filteredData])

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Payment ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-medium text-gray-500">
            {row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-gray-900">
              {row.original.customerName}
            </div>
            <div className="text-xs text-muted-foreground">
              {row.original.email}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "tier",
        header: "Assigned Tier",
        cell: ({ row }) => {
          const tier = row.original.tier
          return (
            <Badge
              variant="secondary"
              className={`rounded-full font-normal ${
                tier === "General"
                  ? "border border-blue-200 bg-blue-50 text-blue-700"
                  : tier === "Pastoral"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-purple-200 bg-purple-50 text-purple-700"
              }`}
            >
              {tier}
            </Badge>
          )
        },
      },
      {
        accessorKey: "amount",
        header: "Dues Captured",
        cell: ({ row }) => (
          <span className="font-semibold text-gray-800">
            ${row.original.amount}
          </span>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-xs text-gray-600">
            {new Date(row.original.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "Success"
                    ? "bg-emerald-500"
                    : status === "Pending"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              />
              {status}
            </span>
          )
        },
      },
    ],
    []
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="min-h-screen w-full space-y-6 bg-[oklch(0.9779_0.0042_56.3756)] p-6 text-[oklch(0.2178_0_0)]">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Manage Payments
          </h1>
          <p className="mt-2 text-sm text-[oklch(0.4444_0.0096_73.6390)]">
            Monitor dues capture, review status, and filter transaction records.
          </p>
        </div>
        <Button className="gap-2 bg-[oklch(0.4650_0.1470_24.9381)] text-white hover:bg-[oklch(0.3958_0.1331_25.7230)]">
          <Plus size={16} /> Add New Provision
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-[oklch(0.9355_0.0324_80.9937)] bg-white shadow-sm">
          <CardContent className="space-y-2 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.4437_0.1613_26.8994)]"></span>
                <span className="text-sm font-semibold">General Tier Dues</span>
              </div>
              <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                ${stats.general.amount}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Distribution Ratio</span>
                <span className="font-medium">{stats.general.ratio}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-[oklch(0.4437_0.1613_26.8994)]"
                  style={{ width: `${stats.general.ratio}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.9355_0.0324_80.9937)] bg-white shadow-sm">
          <CardContent className="space-y-2 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-semibold">
                  Pastoral Tier Dues
                </span>
              </div>
              <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                ${stats.pastoral.amount}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Distribution Ratio</span>
                <span className="font-medium">{stats.pastoral.ratio}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${stats.pastoral.ratio}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.9355_0.0324_80.9937)] bg-white shadow-sm">
          <CardContent className="space-y-2 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-sm font-semibold">
                  Board Members Dues
                </span>
              </div>
              <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                ${stats.board.amount}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Distribution Ratio</span>
                <span className="font-medium">{stats.board.ratio}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${stats.board.ratio}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar Card */}
      <Card className="border-[oklch(0.9355_0.0324_80.9937)] bg-white shadow-xs">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            <div className="relative w-full lg:w-96">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-[oklch(0.9355_0.0324_80.9937)] bg-amber-50/20 pl-9 focus-visible:ring-[oklch(0.4650_0.1470_24.9381)]"
              />
            </div>

            <div className="flex w-full flex-wrap items-center justify-end gap-3 lg:w-auto">
              <div className="flex items-center gap-2 rounded-md border border-gray-100 bg-gray-50 p-1">
                <span className="flex items-center gap-0.5 px-1 text-xs text-muted-foreground">
                  <DollarSign size={12} /> Amount:
                </span>
                <Input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="h-7 w-16 border-gray-200 bg-white p-1 text-xs"
                />
                <span className="text-xs text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="h-7 w-16 border-gray-200 bg-white p-1 text-xs"
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 gap-2 border-[oklch(0.9355_0.0324_80.9937)] text-xs"
                  >
                    <CalendarIcon size={14} />
                    {selectedDate
                      ? selectedDate.toLocaleDateString()
                      : "Filter Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                  {selectedDate && (
                    <div className="border-t p-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(undefined)}
                        className="text-xs text-red-500"
                      >
                        Clear Date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              <div className="flex h-9 items-center gap-1 rounded-md bg-gray-100 p-1 text-xs">
                {["All", "General", "Pastoral", "Board"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`flex h-7 items-center rounded px-3 py-1 font-medium transition-colors ${
                      selectedTier === tier
                        ? "bg-[oklch(0.4650_0.1470_24.9381)] text-white shadow-xs"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Directory Table */}
      <Card className="overflow-hidden border-[oklch(0.9355_0.0324_80.9937)] bg-white">
        <div className="border-b border-gray-100 bg-gray-50/50 p-4">
          <h3 className="text-lg font-semibold">System Payments Directory</h3>
          <p className="text-xs text-muted-foreground">
            Showing {table.getRowModel().rows.length} filtered records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
                >
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-8 text-center text-sm text-muted-foreground"
                  >
                    No payment records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
