"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { AlertCircle, RefreshCcw, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"

import { useSponsorshipHistory, useDeleteSponsorship } from "@/hooks/useSponsor"
import { toast } from "@workspace/ui/components/sonner"
import type { ZTCSPonsorshipHistoryItem } from "@workspace/types"
import Link from "next/link"
import { SponsorFilter } from "./sopncer-filter"
import SponsorStats from "./sponsor-stats"

type SponsorshipRecord = ZTCSPonsorshipHistoryItem

const getTierBadgeStyle = (tier: string) => {
  switch (tier.toUpperCase()) {
    case "DIAMOND":
      return "bg-sky-100 text-sky-700 border-sky-200"
    case "PLATINUM":
      return "bg-slate-200 text-slate-700 border-slate-300"
    case "GOLD":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "SILVER":
      return "bg-gray-100 text-gray-600 border-gray-200"
    case "BRONZE":
      return "bg-orange-100 text-orange-700 border-orange-200"
    default:
      return "bg-slate-100 text-slate-600"
  }
}

const getStatusStyle = (status: string) => {
  switch (status.toUpperCase()) {
    case "SUCCEEDED":
      return "text-emerald-600"
    case "PENDING":
      return "text-amber-500"
    case "FAILED":
      return "text-red-500"
    default:
      return "text-slate-500"
  }
}

const capitalize = (s: string) => s.charAt(0) + s.slice(1).toLowerCase()

const ITEMS_PER_PAGE = 20

// ---- Column definitions -------------------------------------------------

const baseColumns: ColumnDef<SponsorshipRecord>[] = [
  {
    id: "paymentId",
    header: "PAYMENT ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-500">
        {row.original.id.slice(0, 10)}…
      </span>
    ),
  },
  {
    id: "sponsor",
    header: "SPONSOR",
    accessorKey: "sponsor",
    cell: ({ row }) => {
      const sponsor = row.original.sponsor
      const user = row.original.user
      const name = sponsor?.name || user?.name || "Guest"
      const email = sponsor?.email || user?.email || "No Email"
      const phone = sponsor?.phone || user?.phone || "No Phone"
      return (
        <>
          <div className="font-medium text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">{email}</div>
          <div className="text-xs text-slate-500">{phone}</div>
        </>
      )
    },
  },
  {
    id: "role",
    header: "ROLE",
    accessorKey: "user",
    cell: ({ row }) => {
      const user = row.original.user
      if (!user) return <span>Guest</span>
      const roleMap: Record<string, string> = {
        SUPER_ADMIN: "Admin",
        BOARD: "Board",
        PASTORAL: "Pastoral",
        MEMBER: "Member",
        USER: "User",
      }
      const role = roleMap[user.role] || user.role || "User"
      return <span>{role}</span>
    },
  },
  {
    id: "tier",
    header: "TIER",
    accessorKey: "tier",
    cell: ({ row }) => {
      const displayTier = row.getValue("tier") as string
      if (!displayTier) {
        return <span className="text-slate-400">N/A</span>
      }
      return (
        <Badge
          variant="outline"
          className={`font-semibold capitalize ${getTierBadgeStyle(displayTier)}`}
        >
          {capitalize(displayTier)}
        </Badge>
      )
    },
  },
  {
    id: "amount",
    header: "AMOUNT",
    accessorKey: "amount",
    cell: ({ row }) => (
      <span className="font-bold text-slate-900">
        {row.original.currency === "USD" ? "$" : "€"}
        {row.original.amount.toLocaleString()}
      </span>
    ),
  },
  {
    id: "card",
    header: "CARD",
    accessorFn: (row) =>
      row.cardBrand && row.cardLast4
        ? `${row.cardBrand} ${row.cardLast4}`
        : "—",
    cell: ({ row }) => (
      <span className="text-xs text-slate-500">
        {row.original.cardBrand && row.original.cardLast4
          ? `${row.original.cardBrand.toUpperCase()} ••••${row.original.cardLast4}`
          : "—"}
      </span>
    ),
  },
  {
    id: "status",
    header: "STATUS",
    accessorKey: "status",
    cell: ({ row }) => (
      <span className={`font-semibold ${getStatusStyle(row.original.status)}`}>
        • {capitalize(row.original.status)}
      </span>
    ),
  },
  {
    id: "date",
    header: "DATE",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span className="text-xs text-slate-500">
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
  {
    id: "stripeCustomerId",
    header: "STRIPE ID",
    accessorKey: "stripeCustomerId",
    cell: ({ row }) => {
      const id = row.original.stripeCustomerId
      if (!id) return <span className="text-slate-400">N/A</span>
      return <span className="text-xs text-slate-500">{id}</span>
    },
  },
  {
    id: "receipt",
    header: "RECEIPT URL",
    accessorKey: "receiptUrl",
    cell: ({ row }) => {
      const url = row.original.receiptUrl
      if (!url) return <span className="text-slate-400">No Receipt</span>
      return (
        <Link
          href={url}
          target="_blank"
          className="cursor-pointer text-xs text-blue-400 capitalize hover:underline"
        >
          View Receipt
        </Link>
      )
    },
  }
]

function SponsorTableSkeleton() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            {baseColumns.map((col) => (
              <TableHead key={col.id}>
                {typeof col.header === "string" ? col.header : null}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i}>
              {baseColumns.map((col) => (
                <TableCell key={col.id}>
                  <Skeleton className="h-4 w-24 rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ---- Main component ---------------------------------------------------

export default function Sponsor() {
  const [currentPage, setCurrentPage] = useState(1)

  const { mutateAsync: deleteSponsorship } = useDeleteSponsorship()

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this sponsorship record?")) {
      try {
        await deleteSponsorship(id)
        toast.success("Sponsorship record deleted successfully!")
      } catch (err: any) {
        toast.error(err.message || "Failed to delete sponsorship record")
      }
    }
  }

  const columns = useMemo<ColumnDef<SponsorshipRecord>[]>(
    () => [
      {
        id: "sl",
        header: "SL",
        cell: (info) => (
          <span className="font-medium text-slate-900">
            {(currentPage - 1) * ITEMS_PER_PAGE + info.row.index + 1}
          </span>
        ),
      },
      ...baseColumns,
      {
        id: "action",
        header: "ACTIONS",
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" className="hover:text-red-600" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
      }
    ],
    [currentPage]
  )

  const { data, isLoading, isError, error, refetch, isFetching } =
    useSponsorshipHistory(currentPage, ITEMS_PER_PAGE)

  console.log(data)

  const meta = data?.meta
  const totalPages = meta?.totalPages ?? 1

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  })

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <SponsorStats />
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-red-100 bg-white py-16 text-center shadow-sm">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <h3 className="text-lg font-semibold text-slate-800">
            Failed to load sponsorship data
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred."}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-6 gap-2 border-slate-200"
          >
            <RefreshCcw className="h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <SponsorStats />
      <SponsorFilter />

      {isLoading ? (
        <SponsorTableSkeleton />
      ) : (
        <div
          className={`mt-6 overflow-hidden rounded-xl border bg-white shadow-sm transition-opacity ${
            isFetching ? "opacity-60" : "opacity-100"
          }`}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-slate-50/50">
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
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-16 text-center text-slate-400"
                  >
                    No sponsorship records found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.original.id}>
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
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t p-4">
            <span className="text-xs text-slate-500">
              {meta
                ? `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    meta.totalCount
                  )} of ${meta.totalCount} records`
                : ""}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isFetching}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage >= totalPages || isFetching}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
