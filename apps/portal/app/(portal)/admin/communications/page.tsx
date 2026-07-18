"use client"
"use no compiler"

import React, { useState, useMemo } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Send,
} from "lucide-react"
import { IconLoader2 } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "@workspace/ui/components/sonner"

import { useCommunicationStore } from "@/store/use-communication-store"
import { useAllTickets, useUpdateTicketStatus } from "@/hooks/useSupport"

// Component for table pagination controls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PaginationControls = ({ table }: { table: any }) => (
  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
    <div className="text-xs text-slate-500">
      Showing {table.getRowModel().rows.length} results
    </div>
    <div className="flex items-center space-x-1">
      {/* First page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      {/* Previous page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {/* Current page indicator */}
      <span className="px-2 text-sm font-medium">
        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
      </span>
      {/* Next page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      {/* Last page button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
)

export default function CommunicationUsers() {
  const {
    supportPagination,
    supportFilter,
    setSupportPagination,
    setSupportFilter,
  } = useCommunicationStore()

  // Fetch real support tickets from backend
  const { data: supportTicketsData, isLoading: isSupportLoading, refetch } = useAllTickets({
    page: 1,
    limit: 1000,
  })
  const updateTicketMutation = useUpdateTicketStatus()

  // Dialog and form states
  const [selectedSupport, setSelectedSupport] = useState<any | null>(null)
  const [replyText, setReplyText] = useState("")
  const [adminNoteText, setAdminNoteText] = useState("")
  const [statusVal, setStatusVal] = useState<"PENDING" | "OPEN" | "RESOLVED" | "CLOSED">("RESOLVED")
  const [isResolving, setIsResolving] = useState(false)

  // Logic to filter real support tickets
  const allTickets = supportTicketsData?.data || []
  const filteredSupport = useMemo(
    () =>
      allTickets.filter((s: any) =>
        (s.user?.name || "").toLowerCase().includes(supportFilter.toLowerCase()) ||
        (s.user?.email || "").toLowerCase().includes(supportFilter.toLowerCase()) ||
        (s.subject || "").toLowerCase().includes(supportFilter.toLowerCase()) ||
        (s.message || "").toLowerCase().includes(supportFilter.toLowerCase())
      ),
    [allTickets, supportFilter]
  )

  // Column definitions for Support table
  const supportColumns: ColumnDef<any>[] = [
    { accessorKey: "id", header: "Ticket ID" },
    {
      header: "User Details",
      cell: ({ row }) => {
        const u = row.original.user
        return (
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {u?.name || "Unknown User"}
            </div>
            <div className="text-xs text-slate-500">{u?.email || "No Email"}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const badgeColors =
          status === "PENDING"
            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
            : status === "OPEN"
              ? "bg-sky-500/10 text-sky-600 border border-sky-500/20"
              : status === "RESOLVED"
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "bg-slate-500/10 text-slate-600 border border-slate-500/20"
        return (
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColors}`}>
            {status}
          </span>
        )
      }
    },
    {
      header: "Created At",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {new Date(row.original.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "action",
      header: () => <div className="text-right">Operations</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 shadow-sm"
            onClick={() => {
              setSelectedSupport(row.original)
              setStatusVal(row.original.status)
              setAdminNoteText(row.original.adminNote || "")
              setReplyText("")
            }}
          >
            <Send className="mr-2 h-3 w-3" /> Reply &amp; Resolve
          </Button>
        </div>
      ),
    },
  ]

  // Support table configuration
  const supportTable = useReactTable({
    data: filteredSupport,
    columns: supportColumns,
    state: { pagination: supportPagination },
    onPaginationChange: setSupportPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Submit resolution handler
  const handleResolveSubmit = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message for the user")
      return
    }

    setIsResolving(true)
    try {
      await updateTicketMutation.mutateAsync({
        ticketId: selectedSupport.id,
        status: statusVal,
        adminNote: adminNoteText || `Resolved as ${statusVal}`,
        replyMessage: replyText,
      })
      toast.success("Ticket resolved and reply email sent successfully!")
      setSelectedSupport(null)
      setReplyText("")
      setAdminNoteText("")
      refetch()
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || "Failed to resolve support ticket"
      toast.error(errMsg)
    } finally {
      setIsResolving(false)
    }
  }

  return (
    <div className="min-h-screen space-y-8 bg-slate-50/50 p-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Communication Management
      </h1>

      {/* Support Tickets Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Support Tickets</CardTitle>
          <Input
            placeholder="Search tickets..."
            value={supportFilter}
            onChange={(e) => setSupportFilter(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent className="p-0">
          {isSupportLoading ? (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3 w-1/4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-slate-100/50">
                  {supportTable.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((h) => (
                        <TableHead key={h.id}>
                          {flexRender(h.column.columnDef.header, h.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {supportTable.getRowModel().rows.length > 0 ? (
                    supportTable.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-slate-50">
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
                      <TableCell colSpan={supportColumns.length} className="text-center py-8 text-slate-400">
                        No support tickets found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <PaginationControls table={supportTable} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Reply & Resolve Dialog */}
      <Dialog
        open={!!selectedSupport}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSupport(null)
            setReplyText("")
            setAdminNoteText("")
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Ticket ID: {selectedSupport?.id}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="flex flex-col gap-1 md:flex-row md:justify-between text-sm border-b pb-2">
              <p>
                <strong>From:</strong> {selectedSupport?.user?.name || "Unknown User"} ({selectedSupport?.user?.email})
              </p>
              <p className="text-xs text-slate-500">
                {selectedSupport?.createdAt && new Date(selectedSupport.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Subject</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{selectedSupport?.subject}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">User Message</span>
              <div className="rounded-lg bg-slate-100 dark:bg-slate-900 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {selectedSupport?.message}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Update Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as any)}
                  className="w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="OPEN">OPEN</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Admin Resolution Note (DB)</label>
                <Input
                  placeholder="e.g. Issue resolved by resetting password"
                  value={adminNoteText}
                  onChange={(e) => setAdminNoteText(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Email Reply Message (Sent to User)</label>
              <textarea
                placeholder="Write the response email body that will be sent to the user's registered email..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
                className="w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                const mailtoUrl = `mailto:${selectedSupport?.user?.email}?subject=Re: ${encodeURIComponent(selectedSupport?.subject || "")}&body=${encodeURIComponent(replyText)}`
                window.location.href = mailtoUrl
              }}
            >
              Open Mail Client
            </Button>
            <Button
              disabled={isResolving || !replyText.trim()}
              onClick={handleResolveSubmit}
              className="bg-primary hover:bg-primary/95 text-white"
            >
              {isResolving ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Email &amp; Update
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
