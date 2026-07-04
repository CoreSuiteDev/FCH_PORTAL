"use client"

import React, { useMemo, useState } from "react"
import {
  Search,
  Filter,
  ShieldAlert,
  Mail,
  Shield,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
} from "lucide-react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import { toast } from "@workspace/ui/components/sonner"

import { ZTCIUserOutput } from "@workspace/types"
import { useUsers, useUpdateUserStatus, useDeleteUser } from "@/hooks/useUser"

// Status configurations
const STATUS_COLORS: Record<string, { badge: string; dot: string }> = {
  ACTIVE: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  SUSPENDED: {
    badge: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400",
    dot: "bg-rose-500",
  },
  RESTRICTED: {
    badge: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  BANNED: {
    badge: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400",
    dot: "bg-red-500",
  },
}

// Helper to determine top priority role
const getTopRole = (roles: string[] | undefined): string => {
  if (!roles || roles.length === 0) return "GUEST"
  const upperRoles = roles.map((r) => r.toUpperCase())
  if (upperRoles.includes("SUPER_ADMIN")) return "SUPER_ADMIN"
  if (upperRoles.includes("BOARD")) return "BOARD"
  if (upperRoles.includes("PASTORAL")) return "PASTORAL"
  if (upperRoles.includes("MEMBER")) return "MEMBER"
  return roles[0] || "USER"
}

interface InnerTableProps {
  data: ZTCIUserOutput[]
  columns: ColumnDef<ZTCIUserOutput>[]
  globalFilter: string
  setGlobalFilter: (val: string) => void
  title: string
  description: string
}

const InnerUserTable = ({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
  title,
  description,
}: InnerTableProps) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const name = String(row.getValue("name") || "").toLowerCase()
      const id = String(row.getValue("id") || "").toLowerCase()
      const email = String(row.original.email || "").toLowerCase()
      return name.includes(search) || id.includes(search) || email.includes(search)
    },
  })

  return (
    <Card className="overflow-hidden shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-2">
      <CardHeader className="border-b border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <CardDescription>{description} ({table.getRowModel().rows.length} total)</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {table.getRowModel().rows.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 p-6 text-sm text-slate-400">
            <ShieldAlert className="h-8 w-8 text-slate-300" />
            No records matched your search query.
          </div>
        ) : (
          <div className="block overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-slate-800/40">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="px-6 py-3 text-xs font-semibold uppercase text-slate-500"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/40 border-b border-slate-100 dark:border-slate-900">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const UserTable = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [globalFilter, setGlobalFilter] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // 1. Query user members
  const { data, isLoading, isError, refetch } = useUsers(currentPage, 25)

  // 2. Mutations
  const updateStatusMutation = useUpdateUserStatus()
  const deleteUserMutation = useDeleteUser()

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
    updateStatusMutation.mutate(
      { userId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Access state updated to ${newStatus}`)
        },
        onError: (err: any) => {
          toast.error(`Failed to update status: ${err.message || "Unknown error"}`)
        },
      }
    )
  }

  const handleDeleteConfirm = () => {
    if (!deleteId) return
    deleteUserMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success("User permanently deleted")
        setDeleteId(null)
      },
      onError: (err: any) => {
        toast.error(`Deletion failed: ${err.message || "Unknown error"}`)
        setDeleteId(null)
      },
    })
  }

  // Columns definition for TanStack Table
  const columns = useMemo<ColumnDef<ZTCIUserOutput>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Member ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-slate-500">
            {row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Personal Details",
        cell: ({ row }) => (
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {row.original.name}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
              <Mail className="h-3 w-3" /> {row.original.email}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "roles",
        header: "Access Role",
        cell: ({ row }) => {
          const topRole = getTopRole(row.original.roles)
          const isSuperAdmin = topRole === "SUPER_ADMIN"
          const isBoard = topRole === "BOARD"
          const isPastoral = topRole === "PASTORAL"

          return (
            <Badge
              variant="secondary"
              className={
                isSuperAdmin
                  ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                  : isBoard
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                    : isPastoral
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }
            >
              <Shield className="mr-1 inline h-3 w-3" /> {topRole.toLowerCase()}
            </Badge>
          )
        },
      },
      {
        id: "amountPaid",
        header: "Total Contributed",
        cell: ({ row }) => {
          const totalPaid = row.original.payments
            ? row.original.payments.reduce((sum, p) => sum + (p.amount || 0), 0)
            : 0
          return <span className="font-bold text-slate-900 dark:text-slate-100">${totalPaid.toFixed(2)}</span>
        },
      },
      {
        accessorKey: "createdAt",
        header: "Enrollment Date",
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {new Date(row.original.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Access State",
        cell: ({ row }) => {
          const status = row.original.status || "ACTIVE"
          const cfg = STATUS_COLORS[status.toUpperCase()] || {
            badge: "bg-slate-50 text-slate-700 border-slate-200",
            dot: "bg-slate-400",
          }

          return (
            <Badge
              variant="outline"
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cfg.badge}`}
            >
              <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
              {status.toLowerCase()}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Operations</div>,
        cell: ({ row }) => {
          const user = row.original
          const isActive = user.status === "ACTIVE"

          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`h-7 px-2.5 text-xs font-medium ${
                  isActive
                    ? "border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                }`}
                onClick={() => handleToggleStatus(user.id, user.status)}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending && updateStatusMutation.variables?.userId === user.id && (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                )}
                {isActive ? "Suspend" : "Activate"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-rose-500"
                onClick={() => setDeleteId(user.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )
        },
      },
    ],
    [updateStatusMutation.isPending, updateStatusMutation.variables]
  )

  const usersList: ZTCIUserOutput[] = data?.data || []

  // Global filters logic (combining search and status filters)
  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const matchesStatus =
        selectedStatus === "ALL" || user.status === selectedStatus
      return matchesStatus
    })
  }, [usersList, selectedStatus])

  // Group filtered users by tier tables using priority
  const generalUsers = useMemo(() => {
    return filteredUsers.filter((u) => {
      const topRole = getTopRole(u.roles)
      return topRole === "MEMBER" || topRole === "USER" || topRole === "GUEST"
    })
  }, [filteredUsers])

  const pastoralUsers = useMemo(() => {
    return filteredUsers.filter((u) => {
      const topRole = getTopRole(u.roles)
      return topRole === "PASTORAL"
    })
  }, [filteredUsers])

  const boardUsers = useMemo(() => {
    return filteredUsers.filter((u) => {
      const topRole = getTopRole(u.roles)
      return topRole === "BOARD"
    })
  }, [filteredUsers])

  const superAdminUsers = useMemo(() => {
    return filteredUsers.filter((u) => {
      const topRole = getTopRole(u.roles)
      return topRole === "SUPER_ADMIN"
    })
  }, [filteredUsers])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 text-slate-500 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Retrieving system members database...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2 border border-rose-100 bg-rose-50/20 rounded-xl">
        <ShieldAlert className="h-10 w-10 text-rose-500" />
        <h4 className="text-base font-bold text-slate-800">Connection Failed</h4>
        <p className="text-xs text-slate-500">Failed to fetch the registered members. Please retry.</p>
        <Button variant="outline" onClick={() => refetch()} className="mt-2 h-8 hover:cursor-pointer">
          Retry Connection
        </Button>
      </div>
    )
  }

  const meta = data?.meta
  const totalPages = meta?.totalPages || 1

  return (
    <div className="space-y-6 mt-6">
      {/* Global Search and Filter Bar */}
      <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Filter current view by name, email or member ID..."
              className="w-full bg-white pl-9 dark:bg-slate-800 border-slate-200 focus-visible:ring-rose-800/10 focus-visible:border-slate-300 shadow-none h-10"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1 shrink-0">
              <Filter className="h-3.5 w-3.5" /> Access State:
            </span>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px] h-10 border-slate-200 shadow-none">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="RESTRICTED">Restricted</SelectItem>
                <SelectItem value="BANNED">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Container showing different tables per user role */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-slate-100/70 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
          <TabsTrigger value="general" className="hover:cursor-pointer px-4 py-1.5 text-xs font-semibold">
            General Members ({generalUsers.length})
          </TabsTrigger>
          <TabsTrigger value="pastoral" className="hover:cursor-pointer px-4 py-1.5 text-xs font-semibold">
            Pastoral Members ({pastoralUsers.length})
          </TabsTrigger>
          <TabsTrigger value="board" className="hover:cursor-pointer px-4 py-1.5 text-xs font-semibold">
            Board Members ({boardUsers.length})
          </TabsTrigger>
          <TabsTrigger value="admin" className="hover:cursor-pointer px-4 py-1.5 text-xs font-semibold">
            Super Admins ({superAdminUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="outline-none">
          <InnerUserTable
            data={generalUsers}
            columns={columns}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            title="General Members Directory"
            description="Operational directory for all standard tiered website users and general members."
          />
        </TabsContent>

        <TabsContent value="pastoral" className="outline-none">
          <InnerUserTable
            data={pastoralUsers}
            columns={columns}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            title="Pastoral Members Directory"
            description="Directory of spiritual leadership, pastors, and church administrators."
          />
        </TabsContent>

        <TabsContent value="board" className="outline-none">
          <InnerUserTable
            data={boardUsers}
            columns={columns}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            title="Board Trustees Directory"
            description="Premium list of senior advisory board trustees and key executives."
          />
        </TabsContent>

        <TabsContent value="admin" className="outline-none">
          <InnerUserTable
            data={superAdminUsers}
            columns={columns}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            title="Super Administrators Directory"
            description="System administrators with full global read/write access privileges."
          />
        </TabsContent>
      </Tabs>

      {/* Unified Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="hover:cursor-pointer h-9 px-3 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="hover:cursor-pointer h-9 px-3 text-xs"
            >
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* SHADCN CONFIRMATION MODAL */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account from the directory and revoke all system access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 hover:cursor-pointer"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UserTable
