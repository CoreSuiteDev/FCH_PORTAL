"use client"

import React from "react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Loader2, Edit, Trash2, ShieldAlert } from "lucide-react"
import { ZTCSponsorPlanResponse } from "@workspace/types"

const TIER_COLORS: Record<string, string> = {
  BRONZE: "bg-orange-50 text-orange-700 border-orange-200",
  SILVER: "bg-slate-50 text-slate-700 border-slate-200",
  GOLD: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PLATINUM: "bg-sky-50 text-sky-700 border-sky-200",
  DIAMOND: "bg-indigo-50 text-indigo-700 border-indigo-200",
}

interface SponsorPlansTableProps {
  plans: ZTCSponsorPlanResponse[]
  isLoading: boolean
  isError: boolean
  onEdit: (plan: ZTCSponsorPlanResponse) => void
  onDelete: (id: string) => void
}

export const SponsorPlansTable = ({
  plans,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: SponsorPlansTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Tiers & Plans Directory</h2>
        <p className="text-sm text-slate-500">
          A list of all active sponsorship plans configured for Stripe
          collection.
        </p>
      </div>

      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent">
            <TableHead>TIER</TableHead>
            <TableHead>PLAN NAME</TableHead>
            <TableHead>AMOUNT</TableHead>
            <TableHead>BENEFITS</TableHead>
            <TableHead>DESCRIPTION</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Loader2 className="mb-4 h-8 w-8 animate-spin text-slate-400" />
                  <p>Loading sponsor plans...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-red-500">
                  <ShieldAlert className="mb-4 h-8 w-8" />
                  <p className="font-semibold">Failed to load plans</p>
                </div>
              </TableCell>
            </TableRow>
          ) : plans.length > 0 ? (
            plans.map((plan) => (
              <TableRow key={plan.id} className="border-b border-slate-100">
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize ${TIER_COLORS[plan.tier] || "bg-slate-100 text-slate-800"}`}
                  >
                    {plan.tier}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-slate-900">
                  {plan.planName}
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  {plan.currency === "USD" ? "$ " : "€"}
                  {plan.amount}
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(plan.benefits) &&
                      plan.benefits.map((b: string, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-slate-100 text-xs font-normal text-slate-600"
                        >
                          {b}
                        </Badge>
                      ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate text-slate-500">
                  {plan.description || "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(plan)}
                      className="hover:cursor-pointer"
                    >
                      <Edit className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(plan.id)}
                      className="hover:cursor-pointer hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-64 text-center text-slate-500"
              >
                No sponsor plans found. Create one to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
