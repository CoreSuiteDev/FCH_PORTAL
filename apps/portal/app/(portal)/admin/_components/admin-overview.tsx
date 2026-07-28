"use client"

import React, { useState } from "react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Activity,
  AlertCircle,
  Briefcase,
  Coins,
  DollarSign,
  Heart,
  HelpCircle,
  Inbox,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { useAdminOverview } from "@/hooks/useUser"

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useAdminOverview()
  const [activeChartTab, setActiveChartTab] = useState<"membership" | "revenue">("membership")

  if (isLoading) {
    return (
      <div className="min-h-screen space-y-6 bg-slate-50/50 p-6 dark:bg-slate-950/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-4 w-96 bg-slate-200 dark:bg-slate-800" />
          </div>
          <Skeleton className="h-10 w-32 bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <Skeleton className="h-4 w-32 mb-4 bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-8 w-20 mb-6 bg-slate-200 dark:bg-slate-800" />
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <Skeleton className="h-6 w-48 mb-4 bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-72 w-full bg-slate-200 dark:bg-slate-800" />
        </Card>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-14 w-14 text-rose-500" />
        <h3 className="text-xl font-bold">Failed to load admin metrics</h3>
        <p className="max-w-md text-sm text-slate-500">
          An error occurred while fetching live matrix data from the API. Please ensure the server is running.
        </p>
        <Button onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry Connection
        </Button>
      </div>
    )
  }

  // Quick Action items configuration
  const quickActions = [
    { label: "Members Directory", href: "/admin/members", icon: Users, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
    { label: "Sponsor Plans", href: "/admin/sponsor-plans", icon: Briefcase, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" },
    { label: "Donation Ledger", href: "/admin/donation", icon: Coins, color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30" },
    { label: "Webinar Events", href: "/admin/events", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Package Plans", href: "/admin/membership-packages", icon: DollarSign, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
    { label: "Support Inquiries", href: "/admin/inquiries", icon: Inbox, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30" },
  ]

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Admin Overview
          </h1>
          <p className="text-slate-500 text-sm">
            Live analytics and controls dashboard for organizational and financial upkeep.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="gap-2 border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Stats
        </Button>
      </div>

      {/* KPI CARDS - DYNAMIC GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Members Count */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-850 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Total Accounts
            </h3>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="my-3 text-3xl font-black text-slate-900 dark:text-slate-50">
            {data.membersCount.total}
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            {[
              { label: "Board", val: data.membersCount.roles.BOARD },
              { label: "Pastoral", val: data.membersCount.roles.PASTORAL },
              { label: "General", val: data.membersCount.roles.MEMBER },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                  {item.label}
                </p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {item.val}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* KPI 2: Revenue Matrix */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-850 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Gross Revenue
            </h3>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="my-3 text-3xl font-black text-emerald-600 dark:text-emerald-400">
            ${data.revenue.total.toFixed(2)}
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            {[
              { label: "Members", val: data.revenue.subscriptions },
              { label: "Sponsor", val: data.revenue.sponsorships },
              { label: "Donation", val: data.revenue.donations },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                  {item.label}
                </p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={`$${item.val.toFixed(0)}`}>
                  ${item.val >= 1000 ? `${(item.val / 1000).toFixed(1)}k` : item.val.toFixed(0)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* KPI 3: Status Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-850 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Account Health
            </h3>
            <Activity className="h-4 w-4 text-amber-500" />
          </div>
          <div className="my-3 text-3xl font-black text-slate-900 dark:text-slate-50">
            {data.membersCount.active} <span className="text-xs font-normal text-slate-400">Active</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            {[
              { label: "Suspended", val: data.membersCount.suspended, c: "text-amber-600" },
              { label: "Banned", val: data.membersCount.restricted, c: "text-rose-600" },
              { label: "Uptime", val: "99.9%", c: "text-emerald-600" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                  {item.label}
                </p>
                <p className={`text-base font-bold ${item.c}`}>{item.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KPI 4: Pending Tasks Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-850 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Operations Queue
            </h3>
            <HelpCircle className="h-4 w-4 text-purple-500" />
          </div>
          <div className="my-3 text-3xl font-black text-rose-500">
            {data.pendingTasks.filter((t) => t.priority === "High").length}{" "}
            <span className="text-xs font-normal text-slate-400">Urgent</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            {[
              { label: "Total Tasks", val: data.pendingTasks.length },
              { label: "Web Tasks", val: "2" },
              { label: "Audit Log", val: "OK" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                  {item.label}
                </p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {item.val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACCESS ACTIONS PANEL */}
      <Card className="border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/50 shadow-sm backdrop-blur-sm">
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
            Quick Actions & Platform Directories
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((act) => {
            const Icon = act.icon
            return (
              <Link href={act.href} key={act.label}>
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200/60 bg-white p-4 text-center transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-800/80 dark:bg-slate-900 hover:cursor-pointer group">
                  <div className={`rounded-lg p-2.5 ${act.color} mb-3 group-hover:scale-105 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50">
                    {act.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </CardContent>
      </Card>

      {/* CHARTS CONTAINER - INTERACTIVE TABS */}
      <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Analytics & Operations Trends</CardTitle>
            <CardDescription className="text-slate-500 text-xs mt-0.5">
              Visualize monthly registrations and revenue statistics.
            </CardDescription>
          </div>
          <div className="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <button
              onClick={() => setActiveChartTab("membership")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeChartTab === "membership"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Membership Growth
            </button>
            <button
              onClick={() => setActiveChartTab("revenue")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeChartTab === "revenue"
                  ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Revenue Growth
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === "membership" ? (
              <AreaChart data={data.membershipTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: "8px", borderColor: "#cbd5e1" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Area
                  type="monotone"
                  dataKey="general"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  name="General Members"
                />
                <Area
                  type="monotone"
                  dataKey="pastoral"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.15}
                  name="Pastoral Members"
                />
                <Area
                  type="monotone"
                  dataKey="board"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.15}
                  name="Board Members"
                />
              </AreaChart>
            ) : (
              <BarChart data={data.membershipTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val || 0).toFixed(2)}`, "Revenue"]}
                  contentStyle={{ borderRadius: "8px", borderColor: "#cbd5e1" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar
                  dataKey="revenue"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                  name="Monthly Gross Revenue"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* LOWER TABLES SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Board Member Appointments */}
        <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white/50 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center gap-3 text-xs font-extrabold tracking-wider text-slate-400 uppercase">
              <div className="rounded-lg bg-purple-100 p-1.5 dark:bg-purple-950/40">
                <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              Recent Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentBoardMembers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">No board members found.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.recentBoardMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-4 transition-all duration-200 hover:bg-slate-100/30"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        {m.email}
                      </span>
                    </div>
                    <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400">
                      {m.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Philanthropic Donations */}
        <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white/50 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center gap-3 text-xs font-extrabold tracking-wider text-slate-400 uppercase">
              <div className="rounded-lg bg-rose-100 p-1.5 dark:bg-rose-950/40">
                <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>
              Recent Donations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentDonations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">No donations registered yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.recentDonations.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-4 transition-all duration-200 hover:bg-slate-100/30"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {d.donatorName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                        +${d.amount.toFixed(2)}
                      </span>
                      <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-tight scale-90 mt-0.5">
                        {d.status.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Urgent Operations Tasks Queue */}
        <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white/50 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center gap-3 text-xs font-extrabold tracking-wider text-slate-400 uppercase">
              <div className="rounded-lg bg-amber-100 p-1.5 dark:bg-amber-950/40">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              Tasks Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5">
            {data.pendingTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-none dark:border-slate-800 dark:bg-slate-950 group hover:border-slate-300"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2">
                    {t.title}
                  </span>
                </div>
                <Badge
                  className={`ml-2 scale-90 ${
                    t.priority === "High"
                      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400"
                      : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-850 dark:text-slate-400"
                  }`}
                >
                  {t.priority}
                </Badge>
              </div>
            ))}

            {/* Quick system check metrics inside task card */}
            <div className="pt-2">
              <div className="rounded-xl bg-slate-100/60 p-3.5 dark:bg-slate-950/70 border border-slate-200/40">
                <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <Activity className="h-3 w-3 text-emerald-600" /> Upkeep Stats
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {data.platformUpkeepMetrics.slice(0, 2).map((m) => (
                    <div key={m.id}>
                      <span className="text-slate-400 block text-[9px] uppercase font-semibold">{m.label}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
