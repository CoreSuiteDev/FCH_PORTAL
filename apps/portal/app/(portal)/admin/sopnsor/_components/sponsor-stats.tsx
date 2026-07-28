"use client"

import React from "react"
import { sponsorPackages, totalSummary } from "@/constants/sponsor-data"
import { Card, CardContent } from "@workspace/ui/components/card"
import { useSponsorStats } from "@/hooks/useSponsor"
import { Skeleton } from "@workspace/ui/components/skeleton"

const SponsorStats = () => {
  const { data, isLoading } = useSponsorStats()

  const summary = data?.totalSummary || totalSummary
  const packages = data?.sponsorPackages || sponsorPackages

  if (isLoading) {
    return (
      <div className="space-y-6 pb-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Sponsors Payments</h1>
          <p className="mt-2 text-slate-500">
            Monitor dues capture, review status, and filter transaction records.
          </p>
        </div>

        {/* Full Width Summary Card Skeleton */}
        <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-slate-100 pt-4 md:gap-12 md:border-t-0 md:border-l md:pt-0 md:pl-12">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="rounded-xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="mb-4 h-4 w-24" />
                <Skeleton className="mb-6 h-8 w-20" />
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-4 w-10" />
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
    <div className="space-y-6 pb-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Sponsors Payments</h1>
        <p className="mt-2 text-slate-500">
          Monitor dues capture, review status, and filter transaction records.
        </p>
      </div>

      {/* Full Width Summary Card */}
      <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-1 text-[13px] font-bold text-gray-800 uppercase">
                {summary.title}
              </p>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-indigo-700">
                {summary.mainValue}
                {summary.totalCount !== undefined && (
                  <span className="ml-2 text-xs font-normal text-slate-500 block sm:inline">
                    ({summary.totalCount} sponsors)
                  </span>
                )}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-100 pt-4 md:gap-12 md:border-t-0 md:border-l md:pt-0 md:pl-12 w-full md:w-auto">
              {[
                { label: "LIFETIME", val: summary.lifetime, count: summary.totalCount },
                { label: "YEARLY", val: summary.yearly, count: summary.yearlyCount },
                { label: "MONTHLY", val: summary.monthly, count: summary.monthlyCount },
              ].map((item, idx) => (
                <div key={idx} className="min-w-[100px]">
                  <p className="mb-1 text-[10px] font-bold text-gray-800">
                    {item.label}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">
                    {item.val}
                    {item.count !== undefined && (
                      <span className="ml-1.5 text-xs font-normal text-slate-500">
                        ({item.count})
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {packages.map((pkg: any, i: number) => (
          <Card
            key={i}
            className="group rounded-xl border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <CardContent className="p-6">
              <p className="mb-4 text-[13px] font-bold text-gray-800 uppercase">
                {pkg.title} PACKAGE
              </p>
              <h3 className={`mb-6 text-3xl font-extrabold ${pkg.color}`}>
                {pkg.total}
              </h3>

              <div className="space-y-4 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold text-gray-800 uppercase">
                    Lifetime
                  </p>
                  <p className={`text-xs font-bold ${pkg.light}`}>
                    {pkg.total}
                    {pkg.totalCount !== undefined && (
                      <span className="ml-1 text-[10px] font-normal text-slate-500">
                        ({pkg.totalCount})
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold text-gray-800 uppercase">
                    Yearly
                  </p>
                  <p className={`text-xs font-bold ${pkg.light}`}>
                    {pkg.yearly}
                    {pkg.yearlyCount !== undefined && (
                      <span className="ml-1 text-[10px] font-normal text-slate-500">
                        ({pkg.yearlyCount})
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold text-gray-800 uppercase">
                    Monthly
                  </p>
                  <p className={`text-xs font-bold ${pkg.light}`}>
                    {pkg.monthly}
                    {pkg.monthlyCount !== undefined && (
                      <span className="ml-1 text-[10px] font-normal text-slate-500">
                        ({pkg.monthlyCount})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SponsorStats
