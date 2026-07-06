"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Download,
  Filter,
  Loader2,
  Plus,
  Search,
  ShieldAlert,
} from "lucide-react"
import { useMemo, useState } from "react"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/components/sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import {
  useCreateBoardMember,
  useUpdateUserRole,
  useUsers,
} from "@/hooks/useUser"
import { ZTCIUserOutput } from "@workspace/types"

const clearanceOptions = [
  { value: "MEMBER", label: "General" },
  { value: "PASTORAL", label: "Pastoral" },
  { value: "BOARD", label: "Board" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
]

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

export default function BoardAccess() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTier, setSelectedTier] = useState<string>("All")
  const [globalFilter, setGlobalFilter] = useState("")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createName, setCreateName] = useState("")
  const [createEmail, setCreateEmail] = useState("")

  // 1. Query users
  const { data, isLoading, isError, refetch } = useUsers(currentPage, 25)

  // 2. Role Mutation
  const updateRoleMutation = useUpdateUserRole()

  // 3. Create Board Member Mutation
  const createBoardMemberMutation = useCreateBoardMember()

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createBoardMemberMutation.mutate(
      { name: createName, email: createEmail },
      {
        onSuccess: () => {
          toast.success(
            "Board member account created and invitation sent successfully."
          )
          setIsCreateOpen(false)
          setCreateName("")
          setCreateEmail("")
          refetch()
        },
        onError: (err: unknown) => {
          toast.error(
            `Failed to create board member: ${err instanceof Error ? err.message : "Unknown error"}`
          )
        },
      }
    )
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUpdateRole = (userId: string, newRole: string) => {
    updateRoleMutation.mutate(
      { userId, role: newRole },
      {
        onSuccess: () => {
          toast.success("User access clearance level updated successfully")
        },
        onError: (err: unknown) => {
          toast.error(
            `Clearance update failed: ${err instanceof Error ? err.message : "Unknown error"}`
          )
        },
      }
    )
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text("Directory Permissions Report", 14, 15)

    const tableRows = table
      .getFilteredRowModel()
      .rows.map((row) => [
        row.original.id,
        row.original.name,
        row.original.email,
        getTopRole(row.original.roles),
        row.original.status,
        new Date(row.original.createdAt).toLocaleDateString(),
      ])

    autoTable(doc, {
      startY: 25,
      head: [["ID", "Name", "Email", "Role", "Status", "Joined"]],
      body: tableRows,
    })

    doc.save(`directory-permissions-${selectedTier.toLowerCase()}.pdf`)
  }

  const getTierStyles = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "SUPER_ADMIN":
        return "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50"
      case "BOARD":
        return "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
      case "PASTORAL":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
    }
  }

  const columns = useMemo<ColumnDef<ZTCIUserOutput>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Operator ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-slate-500">
            {row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Identity Profile",
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">
              {row.original.name}
            </div>
            <div className="mt-0.5 text-xs text-slate-400">
              {row.original.email}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Access State",
        cell: ({ row }) => {
          const status = row.original.status || "ACTIVE"
          const isActive = status === "ACTIVE"
          return (
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <span
                className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`}
              />
              {status.toLowerCase()}
            </span>
          )
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
        id: "clearanceLevel",
        header: "Clearance Authority",
        cell: ({ row }) => {
          const user = row.original
          const currentTopRole = getTopRole(user.roles)

          return (
            <div className="w-[150px]">
              <Select
                value={currentTopRole}
                onValueChange={(value) => handleUpdateRole(user.id, value)}
                disabled={
                  updateRoleMutation.isPending &&
                  updateRoleMutation.variables?.userId === user.id
                }
              >
                <SelectTrigger
                  className={`h-8 rounded-md border text-xs font-medium shadow-sm transition-all focus:ring-1 focus:ring-primary ${getTierStyles(currentTopRole)}`}
                >
                  {updateRoleMutation.isPending &&
                  updateRoleMutation.variables?.userId === user.id ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clearanceOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs font-medium"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        },
      },
    ],
    [
      handleUpdateRole,
      updateRoleMutation.isPending,
      updateRoleMutation.variables?.userId,
    ]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const usersList: ZTCIUserOutput[] = data?.data || []

  const finalFilteredData = useMemo(() => {
    return usersList.filter((user) => {
      const topRole = getTopRole(user.roles)
      if (selectedTier === "All") return true
      if (selectedTier === "General")
        return topRole === "MEMBER" || topRole === "USER"
      if (selectedTier === "Pastoral") return topRole === "PASTORAL"
      if (selectedTier === "Board") return topRole === "BOARD"
      if (selectedTier === "Super Admin") return topRole === "SUPER_ADMIN"
      return true
    })
  }, [usersList, selectedTier])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: finalFilteredData,
    columns,
    state: { globalFilter },
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Loader2 className="h-10 w-10 animate-spin text-slate-500" />
        <p className="text-sm font-medium text-slate-500">
          Retrieving security permission records...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50/20 py-20">
        <ShieldAlert className="h-10 w-10 text-rose-500" />
        <h4 className="text-base font-bold text-slate-800">
          Connection Failed
        </h4>
        <p className="text-xs text-slate-500">
          Failed to fetch the registered members. Please retry.
        </p>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="mt-2 h-8 hover:cursor-pointer"
        >
          Retry Connection
        </Button>
      </div>
    )
  }

  const meta = data?.meta
  const totalPages = meta?.totalPages || 1

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:p-6 dark:bg-slate-900 dark:text-slate-50">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Directory Permissions
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage system access criteria and instantly revoke or elevate
            operator role clearances.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="w-full hover:cursor-pointer sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Board Member
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportPDF}
            className="w-full hover:cursor-pointer sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" /> Export Data (PDF)
          </Button>
        </div>
      </div>

      <Card className="border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, token string, role identity..."
                className="w-full border-slate-200 bg-white pl-9 shadow-none focus-visible:border-slate-300 focus-visible:ring-rose-800/10 dark:bg-slate-800"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter Tier:</span>
              </div>
              {["All", "General", "Pastoral", "Board", "Super Admin"].map(
                (tier) => (
                  <Button
                    key={tier}
                    variant={selectedTier === tier ? "default" : "outline"}
                    size="sm"
                    className="h-8 px-3 text-xs hover:cursor-pointer"
                    onClick={() => setSelectedTier(tier)}
                  >
                    {tier}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
        <CardHeader className="border-b border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Active Vault Records
              </CardTitle>
              <CardDescription>
                Showing {table.getRowModel().rows.length} entries matching
                current criteria.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {table.getRowModel().rows.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 p-6 text-sm text-slate-400">
              <ShieldAlert className="h-8 w-8 text-slate-300" />
              No matching security profiles identified inside this scope.
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
                          className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase"
                        >
                          {flexRender(
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
                      className="border-b border-slate-100 hover:bg-slate-50/40 dark:border-slate-900"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-6 py-3.5 text-sm whitespace-nowrap"
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
          )}
        </CardContent>
        {/* PAGINATION SECTION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-9 px-3 text-xs hover:cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="h-9 px-3 text-xs hover:cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Board Member Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Board Member</DialogTitle>
            <DialogDescription>
              {`Enter the new board member's name and email. They will receive an email containing a temporary password.`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Name
              </label>
              <Input
                placeholder="e.g. John Doe"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={createBoardMemberMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBoardMemberMutation.isPending}
              >
                {createBoardMemberMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
