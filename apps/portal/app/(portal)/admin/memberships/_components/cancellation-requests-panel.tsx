"use client"

import React, { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table"
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardDescription, CardTitle } from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/components/sonner"
import { CancellationRequest, useCancellationRequests, useProcessCancellation } from "@/hooks/useCancellationRequests"

// ─── status styles ────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<
  string,
  { className: string; icon: React.ReactNode; label: string }
> = {
  PENDING: {
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
    icon: <Clock className="size-3" />,
    label: "Pending",
  },
  APPROVED: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400",
    icon: <CheckCircle2 className="size-3" />,
    label: "Approved",
  },
  REJECTED: {
    className: "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",
    icon: <XCircle className="size-3" />,
    label: "Rejected",
  },
}

// ─── dialog state ─────────────────────────────────────────────────────────────

type DialogState =
  | { kind: "none" }
  | { kind: "approve"; request: CancellationRequest }
  | { kind: "reject"; request: CancellationRequest }

// ─── component ────────────────────────────────────────────────────────────────

export const CancellationRequestsPanel = () => {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [dialog, setDialog] = useState<DialogState>({ kind: "none" })
  const [refundInput, setRefundInput] = useState("")
  const [adminNote, setAdminNote] = useState("")
  const limit = 8

  const { data, isLoading, isError } = useCancellationRequests(page, limit, statusFilter)
  const { mutateAsync: process, isPending } = useProcessCancellation()

  const requests = data?.data ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.ceil(totalCount / limit)

  const openApprove = (req: CancellationRequest) => {
    setRefundInput(req.estimatedRefund.toFixed(2))
    setAdminNote("")
    setDialog({ kind: "approve", request: req })
  }

  const openReject = (req: CancellationRequest) => {
    setAdminNote("")
    setDialog({ kind: "reject", request: req })
  }

  const handleConfirm = async () => {
    if (dialog.kind === "none") return
    const req = dialog.request
    try {
      if (dialog.kind === "approve") {
        const refundAmount = parseFloat(refundInput) || 0
        await process({
          requestId: req.id,
          action: "APPROVE",
          refundAmount,
          adminNote: adminNote || undefined,
        })
        toast.success(
          `Cancellation approved. $${refundAmount.toFixed(2)} refund issued.`
        )
      } else {
        await process({
          requestId: req.id,
          action: "REJECT",
          adminNote: adminNote || undefined,
        })
        toast.success("Cancellation request rejected.")
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to process request.")
    } finally {
      setDialog({ kind: "none" })
    }
  }

  // ── columns ────────────────────────────────────────────────────────────────

  const columns: ColumnDef<CancellationRequest>[] = [
    {
      id: "member",
      header: "Member",
      cell: ({ row }) => (
        <div className="min-w-[150px]">
          <div className="font-semibold text-sm text-slate-900 dark:text-slate-50">
            {row.original.user.name}
          </div>
          <div className="text-xs text-slate-400">{row.original.user.email}</div>
        </div>
      ),
    },
    {
      id: "package",
      header: "Package",
      cell: ({ row }) => {
        const s = row.original.subscription
        return (
          <div>
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {s.packageName}
            </div>
            <div className="text-[10px] text-slate-400">
              {s.tier} · {s.billingCycle === "MONTHLY" ? "Monthly" : "Yearly"}
            </div>
          </div>
        )
      },
    },
    {
      id: "amountPaid",
      header: "Paid",
      cell: ({ row }) => {
        const s = row.original.subscription
        const sym = s.currency === "USD" ? "$" : s.currency + " "
        return (
          <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
            {sym}{s.amountPaid.toFixed(2)}
          </span>
        )
      },
    },
    {
      id: "estimatedRefund",
      header: "Est. Refund",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          ${row.original.estimatedRefund.toFixed(2)}
        </span>
      ),
    },
    {
      id: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <p className="max-w-[200px] text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
          {row.original.reason}
        </p>
      ),
    },
    {
      id: "requestedAt",
      header: "Requested",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {new Date(row.original.createdAt).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = STATUS_STYLE[row.original.status] ?? {
          className: "border-slate-200 bg-slate-50 text-slate-600",
          icon: <Clock className="size-3" />,
          label: row.original.status,
        }
        return (
          <Badge variant="outline" className={`gap-1 font-semibold text-xs ${s.className}`}>
            {s.icon}
            {s.label}
          </Badge>
        )
      },
    },
    {
      id: "refundIssued",
      header: "Refund Issued",
      cell: ({ row }) => {
        const r = row.original
        if (r.status !== "APPROVED") return <span className="text-xs text-slate-400">—</span>
        return (
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            ${(r.refundAmount ?? 0).toFixed(2)}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: () => (
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 flex justify-end">
          Actions
        </span>
      ),
      cell: ({ row }) => {
        const r = row.original
        if (r.status !== "PENDING") {
          return (
            <div className="flex justify-end">
              {r.adminNote ? (
                <span className="text-xs text-slate-400 italic max-w-[160px] line-clamp-2">
                  {r.adminNote}
                </span>
              ) : (
                <span className="text-xs text-slate-300">—</span>
              )}
            </div>
          )
        }
        return (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs hover:text-red-600 hover:border-red-300 cursor-pointer"
              onClick={() => openReject(r)}
            >
              Reject
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              onClick={() => openApprove(r)}
            >
              Approve &amp; Refund
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  return (
    <>
      {/* ── Confirmation Dialog ──────────────────────────────────────────────── */}
      <AlertDialog
        open={dialog.kind !== "none"}
        onOpenChange={(open) => !open && setDialog({ kind: "none" })}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {dialog.kind === "approve" ? (
                <>
                  <CheckCircle2 className="size-5 text-emerald-600" />
                  Approve &amp; Issue Refund
                </>
              ) : (
                <>
                  <XCircle className="size-5 text-red-600" />
                  Reject Cancellation Request
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialog.kind === "approve" ? (
                <>Member <strong>{dialog.request.user.name}</strong> will have their subscription cancelled and receive a partial Stripe refund.</>
              ) : (
                <>The cancellation request from <strong>{dialog.kind === "reject" && dialog.request.user.name}</strong> will be rejected. Their subscription stays active.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-2">
            {dialog.kind === "approve" && (
              <div className="space-y-1.5">
                <Label htmlFor="refundAmount" className="text-sm font-medium">
                  Refund Amount (USD)
                  <span className="text-xs text-slate-400 ml-2 font-normal">
                    Pro-rata calculated · editable
                  </span>
                </Label>
                <Input
                  id="refundAmount"
                  type="number"
                  min={0}
                  step={0.01}
                  value={refundInput}
                  onChange={(e) => setRefundInput(e.target.value)}
                  className="font-mono"
                  placeholder="0.00"
                />
                <p className="text-[11px] text-slate-400">
                  Set to 0 to cancel without a refund.
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="adminNote" className="text-sm font-medium">
                Admin Note
                <span className="text-xs text-slate-400 ml-2 font-normal">optional</span>
              </Label>
              <Textarea
                id="adminNote"
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder={
                  dialog.kind === "approve"
                    ? "e.g. Approved per user's request. Refund for unused 18 days."
                    : "e.g. Insufficient reason provided."
                }
                className="text-sm resize-none"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              disabled={isPending}
              onClick={handleConfirm}
              className={
                dialog.kind === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {isPending
                ? "Processing…"
                : dialog.kind === "approve"
                ? "Confirm Approval"
                : "Confirm Rejection"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Panel Card ──────────────────────────────────────────────────────── */}
      <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Cancellation Requests
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {isLoading
                ? "Loading requests…"
                : `${totalCount} total · page ${page} of ${Math.max(1, totalPages)}`}
            </CardDescription>
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="w-[140px] h-8 shadow-none text-xs border-slate-200 cursor-pointer">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id} className="px-4 py-3 whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-slate-100 dark:border-slate-900">
                    <TableCell className="px-4 py-3"><div className="space-y-1.5"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-40" /></div></TableCell>
                    <TableCell className="px-4 py-3"><div className="space-y-1"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div></TableCell>
                    <TableCell className="px-4 py-3"><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell className="px-4 py-3"><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell className="px-4 py-3"><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell className="px-4 py-3"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="px-4 py-3"><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell className="px-4 py-3"><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell className="px-4 py-3"><div className="flex justify-end gap-2"><Skeleton className="h-8 w-16" /><Skeleton className="h-8 w-28" /></div></TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <AlertTriangle className="size-8 text-slate-300" />
                      Failed to load cancellation requests.
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center text-slate-400 text-sm">
                    No cancellation requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-900">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 text-xs gap-1 cursor-pointer"
              >
                <ChevronLeft className="size-3.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-8 text-xs gap-1 cursor-pointer"
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
