"use client"

import { useDonationStats } from "@/hooks/useDonation"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

const DEFAULT_TIMEFRAME = {
  dailyAmount: 0,
  monthlyAmount: 0,
  yearlyAmount: 0,
  totalAmount: 0,
  dailyCount: 0,
  monthlyCount: 0,
  yearlyCount: 0,
  totalCount: 0,
}

const ROLES_TO_DISPLAY = [
  { key: "MEMBER", label: "GENERAL MEMBERS", color: "text-blue-600" },
  { key: "PASTORAL", label: "PASTORAL TIER", color: "text-emerald-600" },
  { key: "BOARD", label: "BOARD MEMBERS", color: "text-purple-600" },
  { key: "GUEST", label: "GUEST DONATORS", color: "text-amber-600" },
  { key: "SUPER_ADMIN", label: "ADMIN DONATORS", color: "text-rose-600" },
] as const

const DonationStats = () => {
  const { data, isLoading } = useDonationStats()

  const { totalStats = {}, roleStats = {} } = data || {}

  const overallSucceeded = totalStats.SUCCEEDED || DEFAULT_TIMEFRAME
  const overallPending = totalStats.PENDING || DEFAULT_TIMEFRAME
  const overallFailed = totalStats.FAILED || DEFAULT_TIMEFRAME

  if (isLoading) {
    return (
      <div className="mb-8 space-y-6">
        {/* Summary Card Skeleton */}
        <Card className="rounded-xl border-slate-200 bg-slate-50/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-48" />
              </div>
              <div className="grid w-full grid-cols-1 gap-8 border-t border-slate-200 pt-4 sm:grid-cols-3 md:w-auto md:gap-12 md:border-t-0 md:border-l md:pt-0 md:pl-12">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tier Cards Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="rounded-xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-6 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div className="mb-6 h-px w-full bg-slate-100" />
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="space-y-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8 space-y-6">
      {/* Summary Card */}
      <Card className="rounded-xl border-slate-200 bg-slate-50/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400">
                TOTAL REVENUE (SUCCEEDED)
              </p>
              <h3 className="flex flex-wrap items-baseline gap-2 text-4xl font-extrabold text-slate-900">
                ${overallSucceeded.totalAmount.toLocaleString()}
                <span className="text-xs font-normal text-slate-500">
                  ({overallSucceeded.totalCount} successful donations)
                </span>
              </h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>
                  Pending:{" "}
                  <strong className="text-amber-600">
                    ${overallPending.totalAmount.toLocaleString()} (
                    {overallPending.totalCount})
                  </strong>
                </span>
                <span>
                  Failed:{" "}
                  <strong className="text-red-500">
                    ${overallFailed.totalAmount.toLocaleString()} (
                    {overallFailed.totalCount})
                  </strong>
                </span>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 border-t border-slate-200 pt-4 sm:grid-cols-3 md:w-auto md:gap-12 md:border-t-0 md:border-l md:pt-0 md:pl-12">
              {[
                {
                  label: "LIFETIME",
                  val: overallSucceeded.totalAmount,
                  count: overallSucceeded.totalCount,
                },
                {
                  label: "YEARLY",
                  val: overallSucceeded.yearlyAmount,
                  count: overallSucceeded.yearlyCount,
                },
                {
                  label: "MONTHLY",
                  val: overallSucceeded.monthlyAmount,
                  count: overallSucceeded.monthlyCount,
                },
              ].map((item, idx) => (
                <div key={idx} className="min-w-[100px]">
                  <p className="mb-1 text-[10px] font-bold text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    ${item.val.toLocaleString()}
                    <span className="ml-1 text-xs font-normal text-slate-500">
                      ({item.count})
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES_TO_DISPLAY.map((role, i) => {
          const stats = roleStats[role.key] || {}

          const succeeded = stats.SUCCEEDED || DEFAULT_TIMEFRAME
          const pending = stats.PENDING || DEFAULT_TIMEFRAME
          const failed = stats.FAILED || DEFAULT_TIMEFRAME

          return (
            <Card
              key={i}
              className="rounded-xl border-slate-200 shadow-sm transition-all hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400">
                    {role.label}
                  </p>
                  <h3 className={`text-3xl font-extrabold ${role.color}`}>
                    ${succeeded.totalAmount.toLocaleString()}
                  </h3>
                </div>

                <div className="mb-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Succeeded:</span>
                    <span className="font-semibold text-slate-800">
                      ${succeeded.totalAmount.toLocaleString()} (
                      {succeeded.totalCount})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Pending:</span>
                    <span className="font-semibold text-amber-600">
                      ${pending.totalAmount.toLocaleString()} (
                      {pending.totalCount})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Failed/Cancelled:</span>
                    <span className="font-semibold text-red-500">
                      ${failed.totalAmount.toLocaleString()} (
                      {failed.totalCount})
                    </span>
                  </div>
                </div>

                <div className="mb-4 h-px w-full bg-slate-100" />

                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "LIFETIME",
                      val: succeeded.totalAmount,
                      count: succeeded.totalCount,
                    },
                    {
                      label: "YEARLY",
                      val: succeeded.yearlyAmount,
                      count: succeeded.yearlyCount,
                    },
                    {
                      label: "MONTHLY",
                      val: succeeded.monthlyAmount,
                      count: succeeded.monthlyCount,
                    },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <p className="mb-0.5 text-[9px] font-bold text-slate-400">
                        {item.label}
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        ${item.val.toLocaleString()}
                        <span className="block text-[10px] font-normal text-slate-500">
                          ({item.count} tx)
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default DonationStats
