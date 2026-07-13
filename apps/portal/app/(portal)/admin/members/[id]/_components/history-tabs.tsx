"use client"

import React from "react"
import { History, CreditCard, Heart, Briefcase, Info } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

interface HistoryTabsProps {
  membership: {
    subscriptions: Array<{
      id: string
      packageName: string
      packageType: string
      price: number
      status: string
      startsAt: string
      expiresAt: string
    }>
  }
  donations: {
    list: Array<{
      id: string
      amount: number
      currency: string
      status: string
      createdAt: string
      isAnonymous: boolean
      message: string | null
    }>
  }
  sponsorships: {
    list: Array<{
      id: string
      packageName: string
      tier: string
      amount: number
      status: string
      startsAt: string | null
      expiresAt: string | null
    }>
  }
  transactionHistory: Array<{
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
    type: string
    description: string
  }>
}

export default function HistoryTabs({
  membership,
  donations,
  sponsorships,
  transactionHistory,
}: HistoryTabsProps) {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="rounded-lg border border-slate-200/50 bg-slate-100/70 p-1 dark:border-slate-800/50 dark:bg-slate-900/50">
        <TabsTrigger
          value="transactions"
          className="px-4 py-1.5 text-xs font-semibold hover:cursor-pointer"
        >
          <History className="mr-1.5 inline h-3.5 w-3.5" /> Transaction
          History ({transactionHistory.length})
        </TabsTrigger>
        <TabsTrigger
          value="memberships"
          className="px-4 py-1.5 text-xs font-semibold hover:cursor-pointer"
        >
          <CreditCard className="mr-1.5 inline h-3.5 w-3.5" /> Membership
          Purchases ({membership.subscriptions.length})
        </TabsTrigger>
        <TabsTrigger
          value="donations"
          className="px-4 py-1.5 text-xs font-semibold hover:cursor-pointer"
        >
          <Heart className="mr-1.5 inline h-3.5 w-3.5" /> Donations (
          {donations.list.length})
        </TabsTrigger>
        <TabsTrigger
          value="sponsorships"
          className="px-4 py-1.5 text-xs font-semibold hover:cursor-pointer"
        >
          <Briefcase className="mr-1.5 inline h-3.5 w-3.5" /> Sponsorships (
          {sponsorships.list.length})
        </TabsTrigger>
      </TabsList>

      {/* 1. Transaction History */}
      <TabsContent value="transactions" className="outline-none">
        <Card className="mt-4 border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Combined Ledger
            </CardTitle>
            <CardDescription>
              Auditable record of all subscription checkouts, donations, and
              sponsorship payments.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {transactionHistory.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-8 text-center text-sm text-slate-400">
                <Info className="h-8 w-8 text-slate-300" />
                No transactions have been charged or recorded for this member.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/70 dark:bg-slate-800/40">
                    <TableRow>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Tx ID
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Date
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Description
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Category
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Amount
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionHistory.map((tx) => (
                      <TableRow
                        key={tx.id}
                        className="border-b border-slate-100 hover:bg-slate-50/40 dark:border-slate-900"
                      >
                        <TableCell className="px-6 py-4 font-mono text-xs font-semibold whitespace-nowrap text-slate-500">
                          {tx.id}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-slate-500">
                          {new Date(tx.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                          {tx.description}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] tracking-wider uppercase"
                          >
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 font-bold whitespace-nowrap text-slate-950 dark:text-slate-50">
                          ${tx.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={
                              tx.status === "SUCCEEDED" ||
                              tx.status === "ACTIVE"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : tx.status === "PENDING"
                                  ? "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                  : "border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                            }
                          >
                            {tx.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* 2. Membership Subscriptions */}
      <TabsContent value="memberships" className="outline-none">
        <Card className="mt-4 border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Membership Logs
            </CardTitle>
            <CardDescription>
              History of subscriptions and license renewals.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {membership.subscriptions.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-8 text-center text-sm text-slate-400">
                <Info className="h-8 w-8 text-slate-300" />
                No subscriptions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/70 dark:bg-slate-800/40">
                    <TableRow>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Sub ID
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Package Name
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Pricing Tier
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Amount Paid
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Date range
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membership.subscriptions.map((sub) => (
                      <TableRow
                        key={sub.id}
                        className="border-b border-slate-100 hover:bg-slate-50/40 dark:border-slate-900"
                      >
                        <TableCell className="px-6 py-4 font-mono text-xs font-semibold whitespace-nowrap text-slate-500">
                          {sub.id}
                        </TableCell>
                        <TableCell className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                          {sub.packageName}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant="secondary"
                            className="text-[10px] capitalize"
                          >
                            {sub.packageType.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 font-bold whitespace-nowrap">
                          ${sub.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-slate-500">
                          {new Date(sub.startsAt).toLocaleDateString()} -{" "}
                          {new Date(sub.expiresAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={
                              sub.status === "ACTIVE"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }
                          >
                            {sub.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* 3. Donations */}
      <TabsContent value="donations" className="outline-none">
        <Card className="mt-4 border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Personal Donations Ledger
            </CardTitle>
            <CardDescription>
              Individual philanthropic contributions made by this donor.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {donations.list.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-8 text-center text-sm text-slate-400">
                <Info className="h-8 w-8 text-slate-300" />
                No donation records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/70 dark:bg-slate-800/40">
                    <TableRow>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Donation ID
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Date
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Visibility
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Message
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Amount
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.list.map((d) => (
                      <TableRow
                        key={d.id}
                        className="border-b border-slate-100 hover:bg-slate-50/40 dark:border-slate-900"
                      >
                        <TableCell className="px-6 py-4 font-mono text-xs font-semibold whitespace-nowrap text-slate-500">
                          {d.id}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-slate-500">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          {d.isAnonymous ? (
                            <Badge
                              variant="outline"
                              className="border-amber-200 bg-amber-50 text-amber-700"
                            >
                              Anonymous
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-slate-200 bg-slate-50 text-slate-700"
                            >
                              Public
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-slate-600 italic dark:text-slate-400">
                          {d.message ? (
                            `"${d.message}"`
                          ) : (
                            <span className="text-slate-300">No message</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 font-bold whitespace-nowrap text-slate-900 dark:text-slate-100">
                          ${d.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={
                              d.status === "SUCCEEDED"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                            }
                          >
                            {d.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* 4. Sponsorships */}
      <TabsContent value="sponsorships" className="outline-none">
        <Card className="mt-4 border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Corporate & Group Sponsorship Agreements
            </CardTitle>
            <CardDescription>
              Sponsor accounts, tiers, and partnership durations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {sponsorships.list.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-8 text-center text-sm text-slate-400">
                <Info className="h-8 w-8 text-slate-300" />
                No sponsorship agreements found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/70 dark:bg-slate-800/40">
                    <TableRow>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Sponsorship ID
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Plan Name
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Sponsor Tier
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Support Amount
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Duration
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-semibold uppercase">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sponsorships.list.map((s) => (
                      <TableRow
                        key={s.id}
                        className="border-b border-slate-100 hover:bg-slate-50/40 dark:border-slate-900"
                      >
                        <TableCell className="px-6 py-4 font-mono text-xs font-semibold whitespace-nowrap text-slate-500">
                          {s.id}
                        </TableCell>
                        <TableCell className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                          {s.packageName}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Badge className="border-indigo-200 bg-indigo-50 font-mono text-[10px] text-indigo-700 uppercase">
                            {s.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 font-bold whitespace-nowrap">
                          ${s.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-slate-500">
                          {s.startsAt && s.expiresAt
                            ? `${new Date(s.startsAt).toLocaleDateString()} - ${new Date(s.expiresAt).toLocaleDateString()}`
                            : "Open contract"}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={
                              s.status === "SUCCEEDED" ||
                              s.status === "ACTIVE"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                            }
                          >
                            {s.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
