"use client"

import React from "react"
import { UserCheck, CreditCard, Award } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

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
}

export const MembershipStats = ({ stats, pricingStats }: MembershipStatsProps) => {
  return (
    <div className="space-y-6">
      {/* Row 1: Operational Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
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
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Financial Overview by Package Tier
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* General Package */}
          <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                General Package Earnings
              </CardTitle>
              <CreditCard className="size-4 text-slate-400" />
            </CardHeader>
            <CardContent className="flex items-center justify-between mt-1">
              <div>
                <div className="text-3xl font-extrabold text-slate-955 dark:text-slate-50">
                  ${pricingStats.general.earnings.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Total collected revenue</p>
              </div>
              <div className="text-right border-l border-slate-100 pl-4 dark:border-slate-900 space-y-0.5">
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Active Subs:
                </p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Monthly: <span className="font-bold text-slate-800 dark:text-slate-200">{pricingStats.general.monthlyCount}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Yearly: <span className="font-bold text-slate-800 dark:text-slate-200">{pricingStats.general.yearlyCount}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium italic">
                  Daily: <span className="font-semibold text-slate-500">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pastoral Package */}
          <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                Pastoral Package Earnings
              </CardTitle>
              <Award className="size-4 text-amber-500/80" />
            </CardHeader>
            <CardContent className="flex items-center justify-between mt-1">
              <div>
                <div className="text-3xl font-extrabold text-slate-955 dark:text-slate-50">
                  ${pricingStats.pastoral.earnings.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Total collected revenue</p>
              </div>
              <div className="text-right border-l border-slate-100 pl-4 dark:border-slate-900 space-y-0.5">
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Active Subs:
                </p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Monthly: <span className="font-bold text-slate-800 dark:text-slate-200">{pricingStats.pastoral.monthlyCount}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Yearly: <span className="font-bold text-slate-800 dark:text-slate-200">{pricingStats.pastoral.yearlyCount}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium italic">
                  Daily: <span className="font-semibold text-slate-500">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
