"use client"

import React from "react"
import {
  Users,
  CreditCard,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  TrendingDown,
  ShieldCheck,
  PieChart,
  Activity,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import {
  membershipTrends,
  platformUpkeepMetrics,
  recentBoardMembers,
  userDistributions,
} from "@/constants/admin-overview"

export default function DashboardOverview() {
  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:px-6 dark:bg-slate-900 dark:text-slate-50">
      {/* HEADER SECTION */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Internal Custom Membership & Financial Control Center.
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex flex-1 items-center justify-center gap-2 sm:flex-none"
          >
            <RefreshCw className="h-4 w-4" /> Refresh Metrics
          </Button>
          <Button
            size="sm"
            className="flex flex-1 items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 sm:flex-none"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Register New Member
          </Button>
        </div>
      </div>

      {/* 1. MEANINGFUL KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Active Members */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Active Members
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold md:text-3xl">245</div>
            <p className="mt-1 flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +14% since last quarter
            </p>
            <div className="mt-4 grid grid-cols-3 gap-1 text-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <div className="rounded bg-slate-100 p-1 dark:bg-slate-800">
                <span className="block font-bold text-slate-800 dark:text-slate-200">
                  145
                </span>
                General
              </div>
              <div className="rounded bg-slate-100 p-1 dark:bg-slate-800">
                <span className="block font-bold text-slate-800 dark:text-slate-200">
                  85
                </span>
                Pastoral
              </div>
              <div className="rounded bg-slate-100 p-1 dark:bg-slate-800">
                <span className="block font-bold text-slate-800 dark:text-slate-200">
                  15
                </span>
                Board
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Revenue Collection Overview */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue (USD)
            </CardTitle>
            <CreditCard className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold md:text-3xl">$39,375</div>
            <p className="mt-1 flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" /> On track for annual goal
            </p>
            <div className="mt-5">
              <div className="mb-1 flex justify-between text-xs font-medium">
                <span>Goal Progress</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-1.5 [&>div]:bg-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Churn Rate / Retention Metric */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Membership Churn Rate
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold md:text-3xl">2.4%</div>
            <p className="mt-1 flex items-center text-xs text-red-700">
              <ArrowDownRight className="mr-1 h-3 w-3" /> -0.8% down from last
              month
            </p>
            <div className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
              Critical metric tracking the percentage of members leaving the
              platform over time.
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Automated Pipeline Health */}
        <Card className="border-emerald-500/20 bg-emerald-50/20 shadow-sm dark:bg-emerald-950/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Gateway Status
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 md:text-3xl dark:text-emerald-400">
              Operational
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              All instant tier provisionings are processing under normal load.
            </p>
            <div className="mt-3">
              <Badge
                variant="outline"
                className="border-emerald-300 bg-emerald-100 text-[10px] text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
              >
                Auto-Assign Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. MAIN VISUAL CHARTS & RECENT BOARD MEMBERS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Custom Membership Analytics Graph */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Membership Growth Analytics</CardTitle>
            <CardDescription>
              A 6-month visual performance audit tracking custom tiers: General,
              Pastoral, and Board.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={membershipTrends}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorGeneral" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorPastoral"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBoard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="general"
                  name="General Tier"
                  stroke="currentColor"
                  className="text-primary"
                  fillOpacity={1}
                  fill="url(#colorGeneral)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="pastoral"
                  name="Pastoral Tier"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorPastoral)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="board"
                  name="Board Members"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorBoard)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Replace: Recent Board Members Section */}
        <Card className="flex flex-col justify-between shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-500" />
              <CardTitle className="text-base font-semibold">
                Recent Board Members
              </CardTitle>
            </div>
            <CardDescription>
              Latest additions assigned to core board roles and leadership
              tiers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
            {recentBoardMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col justify-between gap-2 rounded-lg border border-slate-100 bg-white p-3 text-xs shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-800"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {member.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{member.email}</p>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2 sm:justify-end sm:border-t-0 sm:pt-0 dark:border-slate-700">
                  <Badge
                    variant="secondary"
                    className="bg-indigo-50 text-[10px] text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                  >
                    {member.role}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 3. LOWER SECTION: USER TIER BREAKDOWN & INFRASTRUCTURE LOGS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Replace: User Membership Tier Distribution Summary */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">
                User Tier Distribution Summary
              </CardTitle>
            </div>
            <CardDescription>
              Live calculations evaluating specific volume percentage metrics
              per membership class.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            {userDistributions.map((dist, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${dist.color}`}
                    />
                    <span className="text-slate-700 dark:text-slate-300">
                      {dist.tier}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {dist.count} accounts
                    </span>
                    {" • "}
                    {dist.percentage}%
                  </div>
                </div>
                <Progress value={dist.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Replace: Real-time Infrastructure Monitoring Panel */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">
                Platform Upkeep & Health
              </CardTitle>
            </div>
            <CardDescription>
              Automated operations runtime diagnostics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {platformUpkeepMetrics.map((metric) => (
              <div
                key={metric.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-800"
              >
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  {metric.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {metric.value}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      metric.status === "good"
                        ? "bg-emerald-500"
                        : metric.status === "warning"
                          ? "bg-amber-500"
                          : "bg-slate-400"
                    }`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
