"use client"

import { UserMember } from "@/hooks/useMembership"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardDescription, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  ExternalLink,
  RefreshCw,
  Search,
  Settings2,
  SlidersHorizontal,
  Trash2,
  XCircle,
} from "lucide-react"
import React, { useMemo, useState } from "react"

// ─── constants ────────────────────────────────────────────────────────────────

const TIER_BADGE: Record<string, string> = {
  Board:
    "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50",
  Pastoral:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
  General:
    "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/50",
}

const SUB_STATUS_STYLE: Record<
  string,
  { className: string; icon: React.ReactNode }
> = {
  Active: {
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
    icon: <CheckCircle2 className="size-3" />,
  },
  Pending: {
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
    icon: <Clock className="size-3" />,
  },
  Expired: {
    className:
      "border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800",
    icon: <AlertCircle className="size-3" />,
  },
  Canceled: {
    className:
      "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50",
    icon: <XCircle className="size-3" />,
  },
  Suspended: {
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
    icon: <Ban className="size-3" />,
  },
}

const PAY_STATUS_STYLE: Record<string, string> = {
  SUCCEEDED:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400",
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
  FAILED:
    "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",
  REFUNDED:
    "border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400",
}

// ─── sub-components ───────────────────────────────────────────────────────────

const SortHeader = ({
  label,
  column,
}: {
  label: string
  column: {
    getIsSorted: () => false | "asc" | "desc"
    toggleSorting: (asc?: boolean) => void
  }
}) => (
  <button
    className="flex items-center gap-1 text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label}
    {column.getIsSorted() === "asc" ? (
      <ArrowUp className="size-3" />
    ) : column.getIsSorted() === "desc" ? (
      <ArrowDown className="size-3" />
    ) : (
      <ArrowUpDown className="size-3 opacity-40" />
    )}
  </button>
)

// ─── dialog state type ────────────────────────────────────────────────────────

type DialogState =
  | { kind: "none" }
  | { kind: "approve"; id: string; name: string }
  | { kind: "reject"; id: string; name: string }
  | {
      kind: "status"
      id: string
      name: string
      newStatus: UserMember["status"]
    }
  | { kind: "delete"; id: string; name: string }

// ─── props ────────────────────────────────────────────────────────────────────

interface MembershipTableProps {
  paginatedData: UserMember[]
  currentPage: number
  totalPages: number
  totalCount: number
  setCurrentPage: (page: number | ((prev: number) => number)) => void
  handleUpdateStatus: (id: string, newStatus: string) => void
  handleDeleteRecord: (id: string) => void
  searchQuery: string
  setSearchQuery: (val: string) => void
  selectedTier: string
  setSelectedTier: (val: string) => void
  selectedStatus: string
  setSelectedStatus: (val: string) => void
  handleResetFilters: () => void
  isLoading?: boolean
  isFetching?: boolean
}

// ─── main component ───────────────────────────────────────────────────────────

export const MembershipTable = ({
  paginatedData,
  currentPage,
  totalPages,
  totalCount,
  setCurrentPage,
  handleUpdateStatus,
  handleDeleteRecord,
  searchQuery,
  setSearchQuery,
  selectedTier,
  setSelectedTier,
  selectedStatus,
  setSelectedStatus,
  handleResetFilters,
  isLoading = false,
  isFetching = false,
}: MembershipTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [dialog, setDialog] = useState<DialogState>({ kind: "none" })

  // ── confirm & execute dialog action ────────────────────────────────────────
  const confirmDialog = () => {
    if (dialog.kind === "approve") handleUpdateStatus(dialog.id, "Active")
    else if (dialog.kind === "reject") handleUpdateStatus(dialog.id, "Canceled")
    else if (dialog.kind === "status")
      handleUpdateStatus(dialog.id, dialog.newStatus)
    else if (dialog.kind === "delete") handleDeleteRecord(dialog.id)
    setDialog({ kind: "none" })
  }

  // ── column definitions ─────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<UserMember>[]>(
    () => [
      {
        id: "member",
        accessorKey: "name",
        header: ({ column }) => <SortHeader label="Member" column={column} />,
        cell: ({ row }) => (
          <div className="min-w-[160px]">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
              {row.original.name}
            </div>
            <div className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              {row.original.email}
            </div>
          </div>
        ),
      },
      {
        id: "plan",
        header: "Plan",
        cell: ({ row }) => (
          <div className="space-y-1">
            <Badge
              variant="outline"
              className={`text-xs font-semibold ${TIER_BADGE[row.original.tier] ?? ""}`}
            >
              {row.original.tier}
            </Badge>
            <div className="text-[10px] font-medium text-slate-400">
              {row.original.packageName} ·{" "}
              {row.original.billingCycle === "MONTHLY" ? "Monthly" : "Yearly"}
            </div>
          </div>
        ),
      },
      {
        id: "joinedDate",
        accessorKey: "joinedDate",
        header: ({ column }) => <SortHeader label="Joined" column={column} />,
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {getValue() as string}
          </span>
        ),
      },
      {
        id: "expiryDate",
        accessorKey: "expiryDate",
        header: ({ column }) => <SortHeader label="Expires" column={column} />,
        cell: ({ row }) => {
          const isExpired = row.original.status === "Expired"
          return (
            <span
              className={`text-sm font-medium ${
                isExpired
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {row.original.expiryDate}
            </span>
          )
        },
      },
      {
        id: "amount",
        accessorKey: "amountPaid",
        header: ({ column }) => <SortHeader label="Amount" column={column} />,
        cell: ({ getValue }) => (
          <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
            {getValue() as string}
          </span>
        ),
      },
      {
        id: "subscriptionStatus",
        accessorKey: "status",
        header: "Sub Status",
        cell: ({ getValue }) => {
          const s = getValue() as string
          const style = SUB_STATUS_STYLE[s] ?? {
            className: "bg-slate-100 text-slate-800",
            icon: <AlertCircle className="size-3" />,
          }
          return (
            <Badge
              variant="outline"
              className={`gap-1 text-xs font-semibold ${style.className}`}
            >
              {style.icon}
              {s}
            </Badge>
          )
        },
      },
      {
        id: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => {
          const ps = row.original.paymentStatus
          if (!ps) return <span className="text-xs text-slate-400">—</span>
          return (
            <Badge
              variant="outline"
              className={`text-xs font-semibold ${PAY_STATUS_STYLE[ps] ?? "bg-slate-100 text-slate-700"}`}
            >
              {ps}
            </Badge>
          )
        },
      },
      {
        id: "card",
        header: "Card",
        cell: ({ row }) => {
          const { cardBrand, cardLast4, receiptUrl } = row.original
          if (!cardBrand && !cardLast4)
            return <span className="text-xs text-slate-400">—</span>
          return (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-default items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                    <CreditCard className="size-3.5 shrink-0" />
                    <span className="capitalize">{cardBrand ?? ""}</span>
                    {cardLast4 && <span>·· {cardLast4}</span>}
                    {receiptUrl && (
                      <a
                        href={receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-0.5 text-primary hover:text-primary/80"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">
                    {cardBrand
                      ? `${cardBrand.toUpperCase()} ending in ${cardLast4 ?? "—"}`
                      : "Card info"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      {
        id: "stripeId",
        header: "Stripe ID",
        cell: ({ row }) => {
          const txn = row.original.stripePaymentIntentId
          if (!txn) return <span className="text-xs text-slate-400">—</span>
          const short = `${txn.slice(0, 8)}…${txn.slice(-4)}`
          return (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-default font-mono text-[10px] text-slate-400 select-all">
                    {short}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs break-all">
                  <p className="font-mono text-xs">{txn}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      {
        id: "receiptUrl",
        header: "Receipt URL",
        cell: ({ row }) => {
          const url = row.original.receiptUrl
          if (!url) return <span className="text-xs text-slate-400">—</span>
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-350 cursor-pointer"
            >
              View Receipt
              <ExternalLink className="size-3.5" />
            </a>
          )
        },
      },
      {
        id: "actions",
        header: () => (
          <span className="flex justify-end text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Actions
          </span>
        ),
        cell: ({ row }) => {
          const u = row.original
          return (
            <div className="flex items-center justify-end gap-2">
              {u.status === "Pending" ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-slate-200 text-xs text-slate-600 hover:cursor-pointer hover:text-red-600"
                    onClick={() =>
                      setDialog({ kind: "reject", id: u.id, name: u.name })
                    }
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 bg-slate-900 text-xs text-white hover:cursor-pointer hover:bg-slate-800"
                    onClick={() =>
                      setDialog({ kind: "approve", id: u.id, name: u.name })
                    }
                  >
                    Approve
                  </Button>
                </>
              ) : (
                <>
                  <Select
                    value={u.status}
                    onValueChange={(val: UserMember["status"]) =>
                      setDialog({
                        kind: "status",
                        id: u.id,
                        name: u.name,
                        newStatus: val,
                      })
                    }
                  >
                    <SelectTrigger className="h-8 w-[120px] cursor-pointer border-slate-200 text-xs shadow-none">
                      <Settings2 className="mr-1 size-3 shrink-0 text-slate-400" />
                      <SelectValue placeholder="Set Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Canceled">Canceled</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:cursor-pointer hover:bg-red-50 hover:text-red-600"
                    onClick={() =>
                      setDialog({ kind: "delete", id: u.id, name: u.name })
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </>
              )}
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  })

  // ── dialog content ─────────────────────────────────────────────────────────
  const dialogTitle = () => {
    if (dialog.kind === "approve") return `Approve "${dialog.name}"?`
    if (dialog.kind === "reject") return `Reject "${dialog.name}"?`
    if (dialog.kind === "status")
      return `Change status to "${dialog.newStatus}"?`
    if (dialog.kind === "delete") return `Delete "${dialog.name}"?`
    return ""
  }
  const dialogDesc = () => {
    if (dialog.kind === "approve")
      return "This will activate the membership and grant portal access to this member."
    if (dialog.kind === "reject")
      return "This will cancel the membership. The member will lose access to the portal."
    if (dialog.kind === "status")
      return `The subscription status for "${dialog.name}" will be updated. This action can be reversed later.`
    if (dialog.kind === "delete")
      return "This will permanently delete the membership record. This action cannot be undone."
    return ""
  }

  return (
    <>
      {/* ── Confirmation Dialog ─────────────────────────────────────────────── */}
      <AlertDialog
        open={dialog.kind !== "none"}
        onOpenChange={(open) => !open && setDialog({ kind: "none" })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle()}</AlertDialogTitle>
            <AlertDialogDescription>{dialogDesc()}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDialog}
              className={
                dialog.kind === "delete" || dialog.kind === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }
            >
              {dialog.kind === "approve"
                ? "Approve"
                : dialog.kind === "reject"
                  ? "Reject"
                  : dialog.kind === "delete"
                    ? "Delete"
                    : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Table Card ─────────────────────────────────────────────────────── */}
      <Card className="overflow-hidden border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-4 border-b border-slate-100 p-6 dark:border-slate-900">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                Members Directory &amp; Status Sync
                {isFetching && !isLoading && (
                  <RefreshCw className="size-4 animate-spin text-slate-400" />
                )}
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                {isLoading
                  ? "Loading membership records…"
                  : `${totalCount} record${totalCount !== 1 ? "s" : ""} found — page ${currentPage} of ${Math.max(1, totalPages)}`}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 shrink-0 gap-1.5 self-start hover:cursor-pointer sm:self-auto"
            >
              <RefreshCw className="size-3.5" /> Reset Filters
            </Button>
          </div>

          <div className="flex flex-col items-stretch gap-4 pt-2 lg:flex-row lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute top-3 left-3 size-4 text-slate-400" />
              <Input
                placeholder="Search by member name, email or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 border-slate-200 bg-white pl-9 shadow-none focus-visible:border-slate-300 focus-visible:ring-rose-800/10 dark:border-slate-800"
              />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-3.5 text-slate-400" />
                <span className="text-xs font-medium text-slate-500">
                  Tier:
                </span>
              </div>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="h-10 w-[140px] cursor-pointer border-slate-200 capitalize shadow-none">
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Tiers</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Pastoral">Pastoral</SelectItem>
                </SelectContent>
              </Select>

              <span className="text-xs font-medium text-slate-500">
                Status:
              </span>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-10 w-[140px] cursor-pointer border-slate-200 capitalize shadow-none">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead
                      key={h.id}
                      className="px-4 py-3 whitespace-nowrap"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="border-b border-slate-100 dark:border-slate-900"
                  >
                    {/* member */}
                    <TableCell className="px-4 py-3">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-44" />
                      </div>
                    </TableCell>
                    {/* plan */}
                    <TableCell className="px-4 py-3">
                      <div className="space-y-1.5">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </TableCell>
                    {/* joined */}
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    {/* expires */}
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    {/* amount */}
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-4 w-14" />
                    </TableCell>
                    {/* sub status */}
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    {/* payment status */}
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    {/* card */}
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    {/* stripe txn */}
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    {/* receipt url */}
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    {/* actions */}
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-28" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 dark:border-slate-900 dark:hover:bg-slate-900/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 whitespace-nowrap"
                      >
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
                    className="h-64 text-center text-slate-500 dark:text-slate-400"
                  >
                    No membership records matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Pagination ─────────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-900">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.max(1, typeof p === "number" ? p - 1 : p)
                  )
                }
                disabled={currentPage === 1}
                className="h-8 gap-1 text-xs hover:cursor-pointer"
              >
                <ChevronLeft className="size-3.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, typeof p === "number" ? p + 1 : p)
                  )
                }
                disabled={currentPage === totalPages}
                className="h-8 gap-1 text-xs hover:cursor-pointer"
              >
                Next
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  )
}
