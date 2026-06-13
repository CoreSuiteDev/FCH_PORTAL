"use client"

import React from "react"
import {
  Users,
  CreditCard,
  RefreshCw,
  TrendingUp,
  FileText,
  AlertCircle,
  Activity,
  ShieldCheck,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

// Note: Ensure membershipTrends data includes keys: general, pastoral, board
import {
  membershipTrends,
  recentBoardMembers,
  recentFormSubmissions,
  pendingTasks,
  platformUpkeepMetrics,
} from "@/constants/admin-overview"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Admin Overview
          </h1>
          <p className="text-slate-500">
            Comprehensive control center for organizational operations.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 border-slate-300 hover:bg-slate-100"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </Button>
      </div>

      {/* KPI CARDS - PREMIUM DESIGN */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Membership Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-medium tracking-wider text-slate-500 uppercase">
            Total Members
          </h3>
          <div className="my-4 text-4xl font-extrabold text-blue-600">245</div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            {[
              { label: "Board", val: "12" },
              { label: "Pastoral", val: "48" },
              { label: "General", val: "185" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] text-slate-400 uppercase">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {item.val}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-medium tracking-wider text-slate-500 uppercase">
            Total Revenue
          </h3>
          <div className="my-4 text-4xl font-extrabold text-emerald-600">
            $39,375
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            {[
              { label: "Life", val: "120k" },
              { label: "Year", val: "39k" },
              { label: "Month", val: "4.2k" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] text-slate-400 uppercase">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  ${item.val}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Dynamics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-medium tracking-wider text-slate-500 uppercase">
            Churn Rate
          </h3>
          <div className="my-4 text-4xl font-extrabold text-amber-600">
            2.4%
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            {[
              { label: "New", val: "+12", c: "text-emerald-500" },
              { label: "Exp", val: "-4", c: "text-rose-500" },
              { label: "Ren", val: "38", c: "text-blue-500" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] text-slate-400 uppercase">
                  {item.label}
                </p>
                <p className={`text-lg font-semibold ${item.c}`}>{item.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ops Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-medium tracking-wider text-slate-500 uppercase">
            Ops Activity
          </h3>
          <div className="my-4 text-4xl font-extrabold text-rose-600">
            {pendingTasks.length}
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            {[
              { label: "High", val: "4" },
              { label: "Logs", val: "12" },
              { label: "Audit", val: "OK" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] text-slate-400 uppercase">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {item.val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Growth Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={membershipTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="general"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="General"
              />
              <Area
                type="monotone"
                dataKey="pastoral"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Pastoral"
              />
              <Area
                type="monotone"
                dataKey="board"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
                name="Board"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* LOWER SECTION */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Recent Board Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-purple-600" /> Recent
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBoardMembers.slice(0, 3).map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <span className="text-sm font-medium">{m.name}</span>
                <Badge
                  variant="outline"
                  className="border-purple-200 bg-purple-50 text-purple-700"
                >
                  {m.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-rose-600" /> Urgent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between text-sm"
              >
                {t.title}
                <Badge
                  className={
                    t.priority === "High" ? "bg-rose-500" : "bg-sky-500"
                  }
                >
                  {t.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Infrastructure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-emerald-600" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {platformUpkeepMetrics.map((m) => (
              <div key={m.id} className="flex justify-between text-sm">
                <span className="text-slate-600">{m.label}</span>
                <span className="font-bold text-emerald-600">{m.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
