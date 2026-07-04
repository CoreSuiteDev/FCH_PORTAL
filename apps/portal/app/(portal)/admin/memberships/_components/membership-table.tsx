"use client"

import React from "react"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Ban,
  Trash2,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardDescription,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { UserMember } from "@/constants/manage-users-data"

const TIER_BADGE_COLORS: Record<string, string> = {
  Board: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50",
  Pastoral: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
  General: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/50",
}

const STATUS_BADGE_STYLE: Record<string, { className: string; icon: React.ReactNode }> = {
  Active: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
    icon: <CheckCircle2 className="size-3" />,
  },
  Pending: {
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
    icon: <Clock className="size-3" />,
  },
  Expired: {
    className: "border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800",
    icon: <AlertCircle className="size-3" />,
  },
  Canceled: {
    className: "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50",
    icon: <XCircle className="size-3" />,
  },
  Suspended: {
    className: "border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
    icon: <Ban className="size-3" />,
  },
}

interface MembershipTableProps {
  paginatedData: UserMember[]
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number | ((prev: number) => number)) => void
  handleUpdateStatus: (id: string, newStatus: UserMember["status"]) => void
  handleDeleteRecord: (id: string) => void
}

export const MembershipTable = ({
  paginatedData,
  currentPage,
  totalPages,
  setCurrentPage,
  handleUpdateStatus,
  handleDeleteRecord,
}: MembershipTableProps) => {
  return (
    <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-900">
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50">Members Directory & Status Sync</CardTitle>
        <CardDescription className="text-xs mt-0.5">
          Click actions to manage member status or synchronize subscription groups.
        </CardDescription>
      </div>

      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
          <TableRow>
            <TableHead>MEMBER ID</TableHead>
            <TableHead>MEMBER DETAILS</TableHead>
            <TableHead>TIER / PLAN</TableHead>
            <TableHead>JOINED DATE</TableHead>
            <TableHead>AMOUNT PAID</TableHead>
            <TableHead>MEMBERSHIP STATUS</TableHead>
            <TableHead className="text-right">QUICK ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((user) => {
              const statusBadge = STATUS_BADGE_STYLE[user.status] || {
                className: "bg-slate-100 text-slate-800",
                icon: <AlertCircle className="size-3" />,
              }

              return (
                <TableRow key={user.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <TableCell className="font-mono text-xs font-semibold text-slate-400">
                    {user.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-50">{user.name}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-semibold capitalize ${TIER_BADGE_COLORS[user.tier] || "bg-slate-100 text-slate-800"}`}
                    >
                      {user.tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    {user.joinedDate}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900 dark:text-slate-50 text-sm">
                    {user.amountPaid}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`gap-1 font-semibold ${statusBadge.className}`}
                    >
                      {statusBadge.icon}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(user.id, "Canceled")}
                          className="h-8 hover:cursor-pointer border-slate-200 text-slate-600 hover:text-red-600"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(user.id, "Active")}
                          className="h-8 hover:cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
                        >
                          Approve
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end items-center gap-2">
                        <Select
                          value={user.status}
                          onValueChange={(val: UserMember["status"]) =>
                            handleUpdateStatus(user.id, val)
                          }
                        >
                          <SelectTrigger className="w-[120px] h-8 border-slate-200 shadow-none text-xs">
                            <SelectValue placeholder="Set Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                            <SelectItem value="Canceled">Canceled</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRecord(user.id)}
                          className="h-8 w-8 hover:cursor-pointer hover:bg-red-50 hover:text-red-600 text-slate-400"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center text-slate-500 dark:text-slate-400">
                No membership records matched your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, typeof p === "number" ? p - 1 : p))}
              disabled={currentPage === 1}
              className="hover:cursor-pointer h-8 text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, typeof p === "number" ? p + 1 : p))}
              disabled={currentPage === totalPages}
              className="hover:cursor-pointer h-8 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
