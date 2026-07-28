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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { useNewsletterList, useDeleteNewsletter } from "@/hooks/useInquiries"
import { ZTNewsletter } from "@workspace/types"

export default function NewsletterSubscribersPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading } = useNewsletterList({ page, limit })
  const { mutate: deleteNewsletter, isPending: isDeleting } = useDeleteNewsletter()

  const subscribers = data?.data || []
  const totalCount = data?.meta?.totalCount || 0
  const totalPages = data?.meta?.totalPages || 1

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to unsubscribe this email?")) {
      deleteNewsletter(id)
    }
  }

  const columns: ColumnDef<ZTNewsletter>[] = [
    {
      accessorKey: "name",
      header: "Subscriber Name",
      cell: ({ row }) => (
        <span className="font-medium text-slate-900">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email Address",
      cell: ({ row }) => (
        <span className="text-slate-600">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Subscribed On",
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
            className="h-8 w-8 p-0 border-red-100 hover:bg-red-50"
            onClick={() => handleDelete(row.original.id)}
            disabled={isDeleting}
            title="Delete Subscriber"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: subscribers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-slate-500">
            Manage email subscriptions for monthly newsletters.
          </p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">Subscribers</CardTitle>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {totalCount} Total
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center space-y-2 text-slate-500">
              <Mail className="h-10 w-10 text-slate-300" />
              <p className="text-sm">No subscribers found.</p>
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
                  Showing {subscribers.length} of {totalCount} results
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
    </div>
  )
}
