"use client"

import React, { useMemo } from "react"
import { Mail, Shield, Trash2 } from "lucide-react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef,
} from "@tanstack/react-table"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

import { UserMember } from "@/constants/manage-users-data"
import { useManageUserStore } from "@/store/use-manage-user-store"

const MembershipStatus = () => {
  // Zustand States & Actions
  const {
    users,
    globalFilter,
    selectedTier,
    selectedStatus,

    setGlobalFilter,

    toggleUserStatus,
    openDeleteDialog,
  } = useManageUserStore()

  // 1. DYNAMIC STATUS METRICS CALCULATION (Will not shift when table updates)
  const statusStats = useMemo(() => {
    const totalUsers = users.length || 1
    const activeCount = users.filter(
      (u) => u.status.toLowerCase() === "active"
    ).length
    const expiredCount = users.filter(
      (u) => u.status.toLowerCase() === "expired"
    ).length
    const canceledCount = users.filter(
      (u) => u.status.toLowerCase() === "canceled"
    ).length
    const pendingCount = users.filter(
      (u) => u.status.toLowerCase() === "pending"
    ).length

    return [
      {
        name: "Active",
        count: activeCount,
        pct: Math.round((activeCount / totalUsers) * 100),
        color: "bg-emerald-500",
      },
      {
        name: "Expired",
        count: expiredCount,
        pct: Math.round((expiredCount / totalUsers) * 100),
        color: "bg-amber-500",
      },
      {
        name: "Canceled",
        count: canceledCount,
        pct: Math.round((canceledCount / totalUsers) * 100),
        color: "bg-rose-500",
      },
      {
        name: "Pending",
        count: pendingCount,
        pct: Math.round((pendingCount / totalUsers) * 100),
        color: "bg-blue-500",
      },
    ]
  }, [users])

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
    <div className="pb-4">
      {/* NEW: MEMBERSHIP STATUS SNAPSHOT CARD ROWS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statusStats.map((stat) => (
          <Card
            key={stat.name}
            className="bg-white shadow-xs dark:bg-slate-900"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between space-y-0 pb-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.name} Status
                </span>
                <span className={`h-2 w-2 rounded-full ${stat.color}`} />
              </div>
              <div className="text-xl font-bold">{stat.count}</div>
              <p className="mt-0.5 text-[10px] text-slate-400">
                {stat.pct}% total ratio
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MembershipStatus
