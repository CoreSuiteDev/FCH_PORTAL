"use client"
"use no compiler"

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
import { useMemo } from "react"

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

import {
  supportData,
  SupportTicket,
  UserMember,
} from "@/constants/communication-data"
import { userMembersData } from "@/constants/manage-users-data"
import { useCommunicationStore } from "@/store/use-communication-store"

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
    memberPagination,
    supportPagination,
    memberFilter,
    supportFilter,
    selectedSupport,
    setMemberPagination,
    setSupportPagination,
    setMemberFilter,
    setSupportFilter,
    setSelectedSupport,
  } = useCommunicationStore()

  // Logic to filter members
  const filteredMembers = useMemo(
    () =>
      userMembersData.filter((u) =>
        u.name.toLowerCase().includes(memberFilter.toLowerCase())
      ),
    [memberFilter]
  )

  // Logic to filter support tickets
  const filteredSupport = useMemo(
    () =>
      supportData.filter((s) =>
        s.name.toLowerCase().includes(supportFilter.toLowerCase())
      ),
    [supportFilter]
  )

  // Column definitions for Member table
  const memberColumns: ColumnDef<UserMember>[] = [
    { accessorKey: "id", header: "Member ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "tier", header: "Tier" },
    { accessorKey: "status", header: "Status" },
  ]

  // Column definitions for Support table
  const supportColumns: ColumnDef<SupportTicket>[] = [
    { accessorKey: "id", header: "Ticket ID" },
    {
      accessorKey: "name",
      header: "User Name",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-slate-900">
            {row.original.name}
          </div>
          <div className="text-xs text-slate-500">{row.original.email}</div>
        </div>
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
            onClick={() => setSelectedSupport(row.original)}
          >
            <Send className="mr-2 h-3 w-3" /> Reply
          </Button>
        </div>
      ),
    },
  ]

  // Member table configuration
  // eslint-disable-next-line react-hooks/incompatible-library
  const memberTable = useReactTable({
    data: filteredMembers,
    columns: memberColumns,
    state: { pagination: memberPagination },
    onPaginationChange: setMemberPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Support table configuration
  const supportTable = useReactTable({
    data: filteredSupport,
    columns: supportColumns,
    state: { pagination: supportPagination },
    onPaginationChange: setSupportPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="min-h-screen space-y-8 bg-slate-50/50 p-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Communication Management
      </h1>

      {/* Member Directory Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Member Directory</CardTitle>
          <Input
            placeholder="Search members..."
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-100/50">
              {memberTable.getHeaderGroups().map((hg) => (
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
              {memberTable.getRowModel().rows.map((row) => (
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
              ))}
            </TableBody>
          </Table>
          <PaginationControls table={memberTable} />
        </CardContent>
      </Card>

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
              {supportTable.getRowModel().rows.map((row) => (
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
              ))}
            </TableBody>
          </Table>
          <PaginationControls table={supportTable} />
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog
        open={!!selectedSupport}
        onOpenChange={() => setSelectedSupport(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket ID: {selectedSupport?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <p className="text-sm">
              <strong>From:</strong> {selectedSupport?.name} (
              {selectedSupport?.email})
            </p>
            <div className="rounded-lg bg-slate-100 p-4 text-sm">
              {selectedSupport?.message}
            </div>
          </div>
          <Button
            onClick={() =>
              (window.location.href = `mailto:${selectedSupport?.email}`)
            }
          >
            <Send className="mr-2 h-4 w-4" /> Reply via Email
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
