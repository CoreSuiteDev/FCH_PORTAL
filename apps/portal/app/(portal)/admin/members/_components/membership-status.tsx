"use client"

import React, { useMemo } from "react"
import {
  Mail,
  Shield,
  Trash2,
  Users,
  AlertCircle,
  Building2,
  CreditCard,
} from "lucide-react"
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
  const {
    users,
    globalFilter,

    setGlobalFilter,
    toggleUserStatus,
    openDeleteDialog,
  } = useManageUserStore()

  // 1. DYNAMIC METRICS CALCULATION (Meaningful Insights)
  const statusStats = useMemo(() => {
    const totalUsers = users.length || 0
    const active = users.filter(
      (u) => u.status.toLowerCase() === "active"
    ).length
    const pending = users.filter(
      (u) => u.status.toLowerCase() === "pending"
    ).length
    const duesCollected = users.reduce(
      (sum, u) => sum + (parseFloat(u.amountPaid) || 0),
      0
    )
    const committeeCount = users.filter(
      (u) => (u as any).committees?.length > 0
    ).length

    return [
      {
        name: "Active Members",
        count: active.toString(),
        color: "bg-emerald-500",
        icon: <Users className="h-4 w-4" />,
      },
      {
        name: "Pending Review",
        count: pending.toString(),
        color: "bg-amber-500",
        icon: <AlertCircle className="h-4 w-4" />,
      },
      {
        name: "Committee Active",
        count: committeeCount.toString(),
        color: "bg-indigo-500",
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        name: "Total Dues",
        count: `$${duesCollected}`,
        color: "bg-blue-500",
        icon: <CreditCard className="h-4 w-4" />,
      },
    ]
  }, [users])

  // Columns definition
  const columns = useMemo<ColumnDef<UserMember>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Member ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-500">
            {row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "User Details",
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-slate-900">
              {row.original.name}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Mail className="h-3 w-3" /> {row.original.email}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "tier",
        header: "Tier",
        cell: ({ row }) => (
          <Badge variant="secondary" className="font-medium">
            <Shield className="mr-1 h-3 w-3" /> {row.original.tier}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Access State",
        cell: ({ row }) => {
          const status = row.original.status.toLowerCase()
          return (
            <Badge
              variant="outline"
              className={`capitalize ${status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
            >
              {status}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Operations</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleUserStatus(row.original.id)}
            >
              Toggle
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => openDeleteDialog(row.original.id)}
            >
              <Trash2 className="h-4 w-4 text-rose-500" />
            </Button>
          </div>
        ),
      },
    ],
    [toggleUserStatus, openDeleteDialog]
  )

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-6 py-4">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusStats.map((stat) => (
          <Card key={stat.name} className="shadow-sm">
            <CardContent className="flex items-center p-5">
              <div className={`mr-4 rounded-lg p-3 text-white ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  {stat.name}
                </p>
                <h3 className="text-xl font-bold">{stat.count}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MembershipStatus
