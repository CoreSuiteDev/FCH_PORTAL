"use client"

import React from "react"
import { UserCheck, CreditCard, Award, ArrowDownLeft, Ban, Clock } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

interface MetricRowProps {
  label: string 
  count: number
  amount: number
}

const MetricRow = ({ label, count, amount }: MetricRowProps) => (
  <div className="flex justify-between items-center text-xs py-1 border-b border-slate-50 dark:border-slate-900 last:border-0">
    <span className="text-slate-500 dark:text-slate-400 font-medium">{label}:</span>
    <span className="font-bold text-slate-800 dark:text-slate-200">
      {count} sold ({amount < 0 ? "-" : ""}${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
    </span>
  </div>
)

interface MembershipStatsProps {
  stats: {
    total: number
    active: number
    pending: number
    expiredOrCanceled: number
  }
  pricingStats: {
    general: { earnings: number; monthlyCount: number; yearlyCount: number }
    pastoral: { earnings: number; monthlyCount: number; yearlyCount: number }
  }
  salesStats?: {
    general: {
      daily: { count: number; amount: number }
      monthly: { count: number; amount: number }
      yearly: { count: number; amount: number }
      total: { count: number; amount: number }
    }
    pastoral: {
      daily: { count: number; amount: number }
      monthly: { count: number; amount: number }
      yearly: { count: number; amount: number }
      total: { count: number; amount: number }
    }
  }
  cancelStats?: {
    daily: { count: number; refundSum: number }
    monthly: { count: number; refundSum: number }
    yearly: { count: number; refundSum: number }
    total: { count: number; refundSum: number }
  }
}

export const MembershipStats = ({
  stats,
  pricingStats,
  salesStats = {
    general: {
      daily: { count: 0, amount: 0 },
      monthly: { count: 0, amount: 0 },
      yearly: { count: 0, amount: 0 },
      total: { count: 0, amount: 0 },
    },
    pastoral: {
      daily: { count: 0, amount: 0 },
      monthly: { count: 0, amount: 0 },
      yearly: { count: 0, amount: 0 },
      total: { count: 0, amount: 0 },
    },
  },
  cancelStats = {
    daily: { count: 0, refundSum: 0 },
    monthly: { count: 0, refundSum: 0 },
    yearly: { count: 0, refundSum: 0 },
    total: { count: 0, refundSum: 0 },
  },
}: MembershipStatsProps) => {
  return (
    <div className="space-y-6">
      {/* Row 1: Operational Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="py-4 shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Memberships
            </CardTitle>
            <UserCheck className="size-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{stats.total}</div>
            <p className="text-[10px] text-slate-400 mt-1">Registered members catalog</p>
          </CardContent>
        </Card>

        <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Active Plans
            </CardTitle>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
            <p className="text-[10px] text-slate-400 mt-1">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% active utilization
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Pending Approvals
            </CardTitle>
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-[10px] text-slate-400 mt-1">Requires manual activation</p>
          </CardContent>
        </Card>

        <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Expired & Canceled
            </CardTitle>
            <span className="flex h-2.5 w-2.5 rounded-full bg-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{stats.expiredOrCanceled}</div>
            <p className="text-[10px] text-slate-400 mt-1">Restricted from resource access</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Pricing / Earnings Stats per Package */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Active Income &amp; Package Performance
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* General Package */}
          <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  General Package
                </CardTitle>
                <p className="text-[10px] text-slate-400 mt-0.5">Total collected: ${pricingStats.general.earnings.toLocaleString()}</p>
              </div>
              <CreditCard className="size-4 text-slate-400" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Subs</p>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between border-b pb-0.5 last:border-0">
                    <span className="text-slate-500">Monthly:</span>
                    <span className="font-bold">{pricingStats.general.monthlyCount}</span>
                  </div>
                  <div className="flex justify-between border-b pb-0.5 last:border-0">
                    <span className="text-slate-500">Yearly:</span>
                    <span className="font-bold">{pricingStats.general.yearlyCount}</span>
                  </div>
                </div>
              </div>
              <div className="border-l border-slate-100 pl-4 dark:border-slate-900 space-y-1">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Income Timeline</p>
                <div className="space-y-0.5">
                  <MetricRow label="Daily" count={salesStats.general.daily.count} amount={salesStats.general.daily.amount} />
                  <MetricRow label="Monthly" count={salesStats.general.monthly.count} amount={salesStats.general.monthly.amount} />
                  <MetricRow label="Yearly" count={salesStats.general.yearly.count} amount={salesStats.general.yearly.amount} />
                  <MetricRow label="Total" count={salesStats.general.total.count} amount={salesStats.general.total.amount} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pastoral Package */}
          <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-bold text-amber-600">
                  Pastoral Package
                </CardTitle>
                <p className="text-[10px] text-slate-400 mt-0.5">Total collected: ${pricingStats.pastoral.earnings.toLocaleString()}</p>
              </div>
              <Award className="size-4 text-amber-500/85" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Subs</p>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between border-b pb-0.5 last:border-0">
                    <span className="text-slate-500">Monthly:</span>
                    <span className="font-bold">{pricingStats.pastoral.monthlyCount}</span>
                  </div>
                  <div className="flex justify-between border-b pb-0.5 last:border-0">
                    <span className="text-slate-500">Yearly:</span>
                    <span className="font-bold">{pricingStats.pastoral.yearlyCount}</span>
                  </div>
                </div>
              </div>
              <div className="border-l border-slate-100 pl-4 dark:border-slate-900 space-y-1">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Income Timeline</p>
                <div className="space-y-0.5">
                  <MetricRow label="Daily" count={salesStats.pastoral.daily.count} amount={salesStats.pastoral.daily.amount} />
                  <MetricRow label="Monthly" count={salesStats.pastoral.monthly.count} amount={salesStats.pastoral.monthly.amount} />
                  <MetricRow label="Yearly" count={salesStats.pastoral.yearly.count} amount={salesStats.pastoral.yearly.amount} />
                  <MetricRow label="Total" count={salesStats.pastoral.total.count} amount={salesStats.pastoral.total.amount} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: Cancellations & Partial Refunds Overview */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Cancellations &amp; Partial Refunds Overview
        </h3>
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
              <CardTitle className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Daily Cancellations
              </CardTitle>
              <Clock className="size-3.5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {cancelStats.daily.count} cancelled
              </div>
              <p className="text-[10px] text-red-600 font-semibold mt-0.5">
                Refunded: ${cancelStats.daily.refundSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
              <CardTitle className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Monthly Cancellations
              </CardTitle>
              <Clock className="size-3.5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {cancelStats.monthly.count} cancelled
              </div>
              <p className="text-[10px] text-red-600 font-semibold mt-0.5">
                Refunded: ${cancelStats.monthly.refundSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
              <CardTitle className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Yearly Cancellations
              </CardTitle>
              <Clock className="size-3.5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {cancelStats.yearly.count} cancelled
              </div>
              <p className="text-[10px] text-red-600 font-semibold mt-0.5">
                Refunded: ${cancelStats.yearly.refundSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
              <CardTitle className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Refunded
              </CardTitle>
              <ArrowDownLeft className="size-3.5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {cancelStats.total.count} total
              </div>
              <p className="text-[10px] text-red-600 font-semibold mt-0.5">
                Refunded: ${cancelStats.total.refundSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
