"use client"

import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Trash2,
  Mail,
  Loader2,
} from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { useInqueriesList, useDeleteInquery } from "@/hooks/useInquiries"
import { ZTContactInquery } from "@workspace/types"

export default function ContactInquiriesPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const [selectedInquiry, setSelectedInquiry] = useState<ZTContactInquery | null>(null)

  const { data, isLoading } = useInqueriesList({ page, limit })
  const { mutate: deleteInquery, isPending: isDeleting } = useDeleteInquery()

  const inquiries = data?.data || []
  const totalCount = data?.meta?.totalCount || 0
  const totalPages = data?.meta?.totalPages || 1

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      deleteInquery(id)
    }
  }

  const columns: ColumnDef<ZTContactInquery>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-slate-900">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-slate-600">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "message",
      header: "Message Snippet",
      cell: ({ row }) => {
        const msg = row.original.message || ""
        return (
          <span className="text-slate-500 block max-w-xs truncate">
            {msg}
          </span>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Submitted At",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)
        return (
          <span className="text-xs text-slate-400">
            {date.toLocaleString()}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setSelectedInquiry(row.original)}
            title="View Details"
          >
            <Eye className="h-4 w-4 text-slate-500" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 border-red-100 hover:bg-red-50"
            onClick={() => handleDelete(row.original.id)}
            disabled={isDeleting}
            title="Delete Inquiry"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: inquiries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Contact Inquiries
          </h1>
          <p className="text-sm text-slate-500">
            Manage inquiries submitted by users through the website contact form.
          </p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">Submissions</CardTitle>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {totalCount} Total
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center space-y-2 text-slate-500">
              <Mail className="h-10 w-10 text-slate-300" />
              <p className="text-sm">No inquiries found.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-slate-50">
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((h) => (
                        <TableHead key={h.id}>
                          {flexRender(
                            h.column.columnDef.header,
                            h.getContext()
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-slate-50/50">
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

              {/* Pagination Controls */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="text-xs text-slate-500">
                  Showing {inquiries.length} of {totalCount} results
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-3 text-sm font-medium">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Inquiry Detail Dialog */}
      <Dialog
        open={!!selectedInquiry}
        onOpenChange={() => setSelectedInquiry(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Inquiry Details
            </DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3 text-sm">
                <div className="font-semibold text-slate-500">From</div>
                <div className="col-span-2 font-medium text-slate-900">
                  {selectedInquiry.name}
                </div>

                <div className="font-semibold text-slate-500">Email</div>
                <div className="col-span-2 text-slate-900">
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>

                <div className="font-semibold text-slate-500">Date</div>
                <div className="col-span-2 text-slate-900">
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Message
                </h4>
                <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700 border border-slate-100 max-h-60 overflow-y-auto">
                  {selectedInquiry.message}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() =>
                    (window.location.href = `mailto:${selectedInquiry.email}?subject=Reply to your FCH Inquiry`)
                  }
                  className="bg-primary hover:bg-primary/95 text-white"
                >
                  <Mail className="mr-2 h-4 w-4" /> Reply via Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
