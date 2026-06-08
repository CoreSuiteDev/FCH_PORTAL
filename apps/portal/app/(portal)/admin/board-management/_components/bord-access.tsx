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
  Download,
} from "lucide-react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table"

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
  const {
    accessList,
    globalFilter,
    selectedTier,
    setGlobalFilter,
    setSelectedTier,
    updateClearanceLevel,
    rotateTokens,
  } = useBoardAccessStore()

  const clearanceOptions: AllowedClearance[] = ["General", "Pastoral", "Board"]

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text("Directory Permissions Report", 14, 15)

    const tableRows = table
      .getFilteredRowModel()
      .rows.map((row) => [
        row.original.id,
        row.original.name,
        row.original.role,
        row.original.mfaStatus,
        row.original.lastActive,
        row.original.clearanceLevel,
      ])

    autoTable(doc, {
      startY: 25,
      head: [["ID", "Name", "Role", "MFA", "Activity", "Clearance"]],
      body: tableRows,
    })

    doc.save(`directory-permissions-${selectedTier.toLowerCase()}.pdf`)
  }

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
                  <SelectValue />
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
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:p-6 dark:bg-slate-900 dark:text-slate-50">
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

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportPDF}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" /> Export Data (PDF)
          </Button>
          <Button
            size="sm"
            onClick={rotateTokens}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Rotate Access Tokens
          </Button>
        </div>
      </div>

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
            <div className="hidden md:block">
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
                    <TableRow key={row.id}>
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
      </Card>

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
