"use client"

import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { use } from "react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { useMemberDetails } from "@/hooks/useUser"
import ProfileHeader from "./_components/profile-header"
import MetricCards from "./_components/metric-cards"
import HistoryTabs from "./_components/history-tabs"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function MemberDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const userId = resolvedParams.id
  const router = useRouter()

  const {
    data: details,
    isLoading,
    isError,
    refetch,
  } = useMemberDetails(userId)

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl animate-pulse space-y-4 p-4 md:space-y-6 md:p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-6 w-3/4 max-w-[12rem] rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Profile Card Skeleton */}
        <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <CardContent className="flex flex-col items-center gap-4 p-4 text-center sm:text-left md:flex-row md:gap-6 md:p-6">
            <Skeleton className="h-20 w-20 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex w-full flex-1 flex-col items-center space-y-3 md:items-start">
              <Skeleton className="h-6 w-full max-w-[15rem] rounded bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-4 w-full max-w-[10rem] rounded bg-slate-200 dark:bg-slate-800" />
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                <Skeleton className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic metrics card skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="space-y-3 border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:p-5"
            >
              <Skeleton className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (isError || !details) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-4 py-20 text-center">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h3 className="text-lg font-bold">Failed to load member details</h3>
        <p className="max-w-md text-sm text-slate-500">
          There was an error communicating with the API or this member record
          could not be found.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => router.push("/admin/members")}
          >
            Back to Directory
          </Button>
          <Button className="w-full sm:w-auto" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-4 md:space-y-6 md:p-6">
      {/* Profile Header Block */}
      <ProfileHeader user={details.user} />

      {/* KPI Stats Block */}
      <MetricCards
        membership={details.membership}
        donations={details.donations}
        sponsorships={details.sponsorships}
      />

      {/* Ledger and History tabs Block */}
      <HistoryTabs
        membership={details.membership}
        donations={details.donations}
        sponsorships={details.sponsorships}
        transactionHistory={details.transactionHistory}
      />
    </div>
  )
}