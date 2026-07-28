"use client"

import React from "react"
import { CreditCard, Heart, Briefcase, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader } from "@workspace/ui/components/card"

interface MetricCardsProps {
  membership: {
    hasActiveMembership: boolean
    activePackageName: string | null
    activePeriodStart: string | null
    activePeriodEnd: string | null
    totalPurchases: number
  }
  donations: {
    hasDonated: boolean
    totalCount: number
    totalAmount: number
  }
  sponsorships: {
    hasSponsored: boolean
    totalCount: number
    totalAmount: number
    list: Array<{
      status: string
    }>
  }
}

export default function MetricCards({ membership, donations, sponsorships }: MetricCardsProps) {
  const activeSponsorshipsCount = sponsorships.list.filter(
    (s) => s.status === "SUCCEEDED" || s.status === "ACTIVE"
  ).length

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Membership Details */}
      <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <CreditCard className="h-3.5 w-3.5" /> Membership Plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {membership.hasActiveMembership ? (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />{" "}
                  {membership.activePackageName}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-slate-400">
                  <XCircle className="h-5 w-5" /> No Active Plan
                </span>
              )}
            </div>
            {membership.hasActiveMembership && (
              <div className="mt-1 text-xs text-slate-500">
                Renews/Expires:{" "}
                {new Date(membership.activePeriodEnd!).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Total Plan Purchases</span>
            <span className="font-bold">
              {membership.totalPurchases} times
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Donations */}
      <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <Heart className="h-3.5 w-3.5 text-rose-500" /> Philanthropy /
            Donations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
              ${donations.totalAmount.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Contributed across {donations.totalCount} donation(s)
            </div>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Donor Status</span>
            <span className="font-bold text-rose-600">
              {donations.hasDonated ? "Active Donor" : "None"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Sponsorships */}
      <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <Briefcase className="h-3.5 w-3.5" /> Corporate Sponsorships
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
              ${sponsorships.totalAmount.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Active sponsorships: {activeSponsorshipsCount}
            </div>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Sponsor Status</span>
            <span className="font-bold text-indigo-600">
              {sponsorships.hasSponsored ? "Official Sponsor" : "None"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
