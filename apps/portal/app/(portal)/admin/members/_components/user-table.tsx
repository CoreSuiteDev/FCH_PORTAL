"use client"

import React, { useMemo } from "react"
import {
  Search,
  Filter,
  ShieldAlert,
  SlidersHorizontal,
  Mail,
  Shield,
  Trash2,
  Activity,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
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

import { UserMember } from "@/constants/manage-users-data"
import { useManageUserStore } from "@/store/use-manage-user-store"

const UserTable = () => {
  // Zustand States & Actions
  const {
    users,
    globalFilter,
    selectedTier,
    selectedStatus,
    isDeleteDialogOpen,
    setGlobalFilter,
    setSelectedTier,
    setSelectedStatus,
    toggleUserStatus,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDeleteUser,
  } = useManageUserStore()

  // Columns definition for TanStack Table
  const columns = useMemo<ColumnDef<UserMember>[]>(
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
        header: "Personal Matrix",
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">
              {row.original.name}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
              <Mail className="h-3 w-3" /> {row.original.email}
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
              className={
                tier === "Board"
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : tier === "Pastoral"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }
            >
              <Shield className="mr-1 inline h-3 w-3" /> {tier}
            </Badge>
          )
        },
      },
      {
        accessorKey: "amountPaid",
        header: "Dues Captured",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.amountPaid}</span>
        ),
      },
      {
        accessorKey: "joinedDate",
        header: "Enrollment Date",
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {row.original.joinedDate}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Access State",
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <Badge
              variant="outline"
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                status.toLowerCase() === "active"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                  : status.toLowerCase() === "expired"
                    ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400"
                    : status.toLowerCase() === "canceled"
                      ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400"
                      : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-400"
              }`}
            >
              <span
                className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                  status.toLowerCase() === "active"
                    ? "bg-emerald-500"
                    : status.toLowerCase() === "expired"
                      ? "bg-amber-500"
                      : status.toLowerCase() === "canceled"
                        ? "bg-rose-500"
                        : "bg-blue-500"
                }`}
              />
              {status}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Operations</div>,
        cell: ({ row }) => {
          const user = row.original
          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`h-7 px-2.5 text-xs font-medium ${
                  user.status === "Active"
                    ? "border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                }`}
                onClick={() => toggleUserStatus(user.id)}
              >
                {user.status === "Active" ? "Suspend" : "Activate"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-rose-500"
                onClick={() => openDeleteDialog(user.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )
        },
      },
    ],
    [toggleUserStatus, openDeleteDialog]
  )

  // 2. COMBINED FILTERING LOGIC (Handles Tier and Membership Status updates dynamically)
  const finalFilteredData = useMemo(() => {
    return users.filter((user) => {
      const matchesTier = selectedTier === "All" || user.tier === selectedTier
      const matchesStatus =
        selectedStatus === "All" ||
        user.status.toLowerCase() === selectedStatus.toLowerCase()
      return matchesTier && matchesStatus
    })
  }, [users, selectedTier, selectedStatus])

  // TanStack Table Instance
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: finalFilteredData,
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
      return (
        name.includes(search) || id.includes(search) || email.includes(search)
      )
    },
  })
  return (
    <div>
      {/* SEARCH AND FILTERS CONTROLS */}
      <Card className="pb-4 shadow-sm">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email or user ID..."
                className="w-full bg-white pl-9 dark:bg-slate-800"
                value={globalFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setGlobalFilter(e.target.value)
                }
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Tier Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Tier:</span>
                </div>
                {["All", "General", "Pastoral", "Board"].map((tier) => (
                  <Button
                    key={tier}
                    variant={selectedTier === tier ? "default" : "outline"}
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => setSelectedTier(tier)}
                  >
                    {tier}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* NEW: MEMBERSHIP STATUS INTERACTIVE FILTER ROW */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Activity className="h-3.5 w-3.5" />
              <span>Membership:</span>
            </div>
            {["All", "Active", "Expired", "Canceled", "Pending"].map(
              (status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "secondary" : "ghost"}
                  size="sm"
                  className={`h-7 px-3 text-xs ${
                    selectedStatus === status
                      ? "bg-slate-200 font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                      : "text-slate-500"
                  }`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* CORE MEMBERSHIP MANAGEMENT CONTAINER */}
      <Card className="mt-4 overflow-hidden shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                System Members Directory
              </CardTitle>
              <CardDescription>
                Showing {table.getRowModel().rows.length} filtered records
              </CardDescription>
            </div>
            <SlidersHorizontal className="hidden h-4 w-4 text-slate-400 sm:block" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {table.getRowModel().rows.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 p-6 text-sm text-slate-400">
              <ShieldAlert className="h-8 w-8 text-slate-300" />
              No matching records discovered.
            </div>
          ) : (
            <>
              {/* DESKTOP VIEW */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-slate-50/70 dark:bg-slate-800/40">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className="border-b border-slate-100 dark:border-slate-800"
                      >
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="h-auto px-6 py-3 text-xs font-semibold text-slate-500 uppercase"
                          >
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
                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="border-b border-slate-100 bg-white hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/20"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="h-auto px-6 py-4 whitespace-nowrap"
                          >
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
              </div>

              {/* MOBILE VIEW */}
              <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                {table.getRowModel().rows.map((row) => {
                  const user = row.original
                  return (
                    <div
                      key={user.id}
                      className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            {user.id}
                          </span>
                          <h4 className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {user.name}
                          </h4>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                            <Mail className="h-3 w-3" /> {user.email}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            user.tier === "Board"
                              ? "bg-indigo-50 text-[10px] text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                              : user.tier === "Pastoral"
                                ? "bg-emerald-50 text-[10px] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "bg-slate-100 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }
                        >
                          {user.tier}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-2 text-xs dark:border-slate-700">
                        <div>
                          <span className="block text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                            Dues Received
                          </span>
                          <span className="mt-0.5 block font-semibold">
                            {user.amountPaid}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                            Access State
                          </span>
                          <span className="mt-0.5 flex items-center gap-1.5 font-medium capitalize">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.status.toLowerCase() === "active"
                                  ? "bg-emerald-500"
                                  : user.status.toLowerCase() === "expired"
                                    ? "bg-amber-500"
                                    : user.status.toLowerCase() === "canceled"
                                      ? "bg-rose-500"
                                      : "bg-blue-500"
                              }`}
                            />
                            {user.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-3 dark:border-slate-700">
                        <span className="text-[11px] text-slate-400">
                          Joined: {user.joinedDate}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-7 px-2.5 text-xs font-medium ${
                              user.status === "Active"
                                ? "border-rose-100 text-rose-600"
                                : "border-emerald-100 text-emerald-600"
                            }`}
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.status === "Active" ? "Suspend" : "Activate"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-rose-500"
                            onClick={() => openDeleteDialog(user.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* SHADCN CONFIRMATION MODAL */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => !open && closeDeleteDialog()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account from the directory and revoke all system access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
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
