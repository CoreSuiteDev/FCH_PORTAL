"use client"

import React, { useMemo } from "react"
import {
  Search,
  Filter,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal,
  Terminal,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import {
  BoardMemberAccess,
  AllowedClearance,
} from "@/constants/board-access-data"
import { useBoardAccessStore } from "@/store/use-board-access-store"

export default function BoardAccess() {
  // Pulling everything from separate zustand store
  const {
    accessList,
    globalFilter,
    selectedTier,
    setGlobalFilter,
    setSelectedTier,
    updateClearanceLevel,
    rotateTokens,
    getNeedsAttentionCount,
    getActivePrivilegedCount,
    getMfaPercentage,
  } = useBoardAccessStore()

  const clearanceOptions: AllowedClearance[] = ["General", "Pastoral", "Board"]

  const getTierStyles = (tier: string) => {
    switch (tier) {
      case "Board":
        return "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
      case "Pastoral":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
    }
  }

  const columns = useMemo<ColumnDef<BoardMemberAccess>[]>(
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
              {row.original.role}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "mfaStatus",
        header: "Security Verification",
        cell: ({ row }) => {
          const mfa = row.original.mfaStatus
          return (
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <span
                className={`h-2 w-2 rounded-full ${mfa === "Enabled" ? "bg-emerald-500" : "bg-rose-500"}`}
              />
              {mfa}
            </span>
          )
        },
      },
      {
        accessorKey: "lastActive",
        header: "Activity Log",
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {row.original.lastActive}
          </span>
        ),
      },
      {
        accessorKey: "clearanceLevel",
        header: "Clearance Authority",
        cell: ({ row }) => {
          const member = row.original
          return (
            <div className="w-[140px]">
              <Select
                value={member.clearanceLevel}
                onValueChange={(value) =>
                  updateClearanceLevel(member.id, value as AllowedClearance)
                }
              >
                <SelectTrigger
                  className={`h-8 rounded-md border text-xs font-medium shadow-sm transition-all focus:ring-1 focus:ring-primary ${getTierStyles(member.clearanceLevel)}`}
                >
                  <SelectValue placeholder="Select Clearance" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-slate-200 dark:border-slate-800">
                  {clearanceOptions.map((level) => (
                    <SelectItem
                      key={level}
                      value={level}
                      className="cursor-pointer text-xs font-medium"
                    >
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        },
      },
    ],
    [updateClearanceLevel]
  )

  const finalFilteredData = useMemo(() => {
    if (selectedTier === "All") return accessList
    return accessList.filter((user) => user.clearanceLevel === selectedTier)
  }, [accessList, selectedTier])

  const table = useReactTable({
    data: finalFilteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, // Max 10 rows before shifting to Next Page
      },
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const name = String(row.getValue("name") || "").toLowerCase()
      const id = String(row.getValue("id") || "").toLowerCase()
      const role = String(row.original.role || "").toLowerCase()
      return (
        name.includes(search) || id.includes(search) || role.includes(search)
      )
    },
  })

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:p-6 dark:bg-slate-900 dark:text-slate-50">
      {/* HEADER CONTROL */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Directory Permissions
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage system access criteria and instantly revoke or elevate
            operator tokens.
          </p>
        </div>
        <Button
          size="sm"
          onClick={rotateTokens}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Rotate Access Tokens
        </Button>
      </div>

      {/* SEARCH AND FILTERS CONTROLS */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, token string, role identity..."
                className="w-full bg-white pl-9 dark:bg-slate-800"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter Tier:</span>
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
        </CardContent>
      </Card>

      {/* CORE PERMISSIONS CONTAINER */}
      <Card className="overflow-hidden shadow-sm">
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
            <SlidersHorizontal className="hidden h-4 w-4 text-slate-400 sm:block" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {table.getRowModel().rows.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 p-6 text-sm text-slate-400">
              <ShieldAlert className="h-8 w-8 text-slate-300" />
              No matching security profiles identified inside this scope.
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
                        className="border-b border-slate-100/60 bg-white hover:bg-slate-50/30 dark:border-slate-800/30 dark:bg-slate-900 dark:hover:bg-slate-800/20"
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

              {/* MOBILE VIEW */}
              <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                {table.getRowModel().rows.map((row) => {
                  const member = row.original
                  return (
                    <div
                      key={member.id}
                      className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[10px] text-slate-400">
                            {member.id}
                          </span>
                          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {member.name}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {member.role}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            member.mfaStatus === "Enabled"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                              : "border-rose-200 bg-rose-50 text-rose-700"
                          }
                        >
                          {member.mfaStatus}
                        </Badge>
                      </div>

                      <div className="space-y-1 border-t border-slate-200/60 pt-2.5 dark:border-slate-800">
                        <Select
                          value={member.clearanceLevel}
                          onValueChange={(value) =>
                            updateClearanceLevel(
                              member.id,
                              value as AllowedClearance
                            )
                          }
                        >
                          <SelectTrigger
                            className={`h-8 w-full rounded-md border text-xs font-medium ${getTierStyles(member.clearanceLevel)}`}
                          >
                            <SelectValue placeholder="Clearance Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {clearanceOptions.map((level) => (
                              <SelectItem
                                key={level}
                                value={level}
                                className="text-xs font-medium"
                              >
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" /> Heartbeat:
                        </span>
                        <span className="font-mono">{member.lastActive}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* PAGINATION CONTROLS */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs text-slate-500">
                  Page{" "}
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {table.getState().pagination.pageIndex + 1}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {table.getPageCount()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Footer Audit Badge */}
      <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-400 dark:text-slate-500">
        <Terminal className="h-3.5 w-3.5 text-primary" />
        <span>
          Cryptographic audit log system fully locked down under active global
          configurations.
        </span>
      </div>
    </div>
  )
}
