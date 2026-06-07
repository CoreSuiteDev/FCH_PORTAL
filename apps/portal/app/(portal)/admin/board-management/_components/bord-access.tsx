"use client"

import React, { useState } from "react"
import {
  ShieldCheck,
  Key,
  Lock,
  UserCheck,
  Fingerprint,
  RefreshCw,
  AlertOctagon,
  Eye,
  Settings2,
  Terminal,
  ShieldAlert,
  Server,
} from "lucide-react"
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
  BoardMemberAccess,
  boardMembersAccessData,
  boardSecurityMetrics,
  PermissionScope,
  permissionScopesData,
  SecurityMetric,
} from "@/constants/board-access-data"

export default function BoardAccess() {
  const [accessList, setAccessList] = useState<BoardMemberAccess[]>(
    boardMembersAccessData
  )

  const triggerKeyRotation = () => {
    alert("Cryptographic access keys have been queued for global rotation.")
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:p-6 dark:bg-slate-900 dark:text-slate-50">
      {/* HEADER SECTION WITH IMMEDIATE ADMINISTRATIVE ACTION */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
            <Lock className="h-7 w-7 text-indigo-600" /> Board Access Control
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            High-privilege security management, cryptographic keys, and token
            lifecycles.
          </p>
        </div>
        <Button
          size="sm"
          onClick={triggerKeyRotation}
          className="flex w-full items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-500 sm:w-auto"
        >
          <RefreshCw className="h-4 w-4" /> Rotate Access Tokens
        </Button>
      </div>

      {/* PRIVILEGED SECURITY COMPLIANCE METRICS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {boardSecurityMetrics.map((metric: SecurityMetric, index: number) => (
          <Card
            key={index}
            className="border-l-4 border-l-indigo-500 shadow-sm"
          >
            <CardContent className="lifted space-y-3 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  {metric.label}
                </span>
                <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {metric.value}
                </span>
              </div>
              <div className="space-y-1">
                <Progress
                  value={metric.percentage}
                  className="h-1.5 [&>div]:bg-green-600"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* PRIVILEGED DIRECTORY & IDENTITY POLICIES */}
        <Card className="flex flex-col shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-indigo-500" />
              <div>
                <CardTitle className="text-base font-semibold">
                  Authorized Board Operators
                </CardTitle>
                <CardDescription>
                  Live state of multi-factor states and clearance matrixes.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0">
            {/* DESKTOP MATRIX */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/40">
                  <tr>
                    <th className="px-6 py-3">Operator ID</th>
                    <th className="px-6 py-3">Profile Identity</th>
                    <th className="px-6 py-3">Clearance Threshold</th>
                    <th className="px-6 py-3">MFA Status</th>
                    <th className="px-6 py-3">Session State</th>
                    <th className="px-6 py-3 text-right">Policy Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {accessList.map((member: BoardMemberAccess) => (
                    <tr
                      key={member.id}
                      className="bg-white hover:bg-slate-50/50 dark:bg-slate-900"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-400">
                        {member.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {member.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {member.role}
                        </div>
                      </td>
                      <td className="lifted px-6 py-4">
                        <Badge
                          variant="outline"
                          className="border-indigo-200 bg-indigo-50/50 text-xs text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400"
                        >
                          {member.clearanceLevel}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            member.mfaStatus === "Enabled"
                              ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10"
                              : "bg-rose-500/10 text-rose-700 hover:bg-rose-500/10"
                          }
                        >
                          {member.mfaStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {member.lastActive}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-slate-500 hover:text-indigo-600"
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE ADAPTIVE MATRIX */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
              {accessList.map((member: BoardMemberAccess) => (
                <div
                  key={member.id}
                  className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400">
                        {member.id}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {member.name}
                      </h4>
                      <p className="text-xs text-slate-400">{member.role}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-indigo-100 text-[10px] text-indigo-700"
                    >
                      {member.clearanceLevel.split("-")[0]}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2 text-xs dark:border-slate-700">
                    <span className="text-slate-400">MFA Validation</span>
                    <span
                      className={
                        member.mfaStatus === "Enabled"
                          ? "font-medium text-emerald-600"
                          : "font-medium text-rose-600"
                      }
                    >
                      {member.mfaStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-400">Heartbeat</span>
                    <span className="text-slate-500">{member.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GRANULAR PERMISSION SCOPES MANAGEMENT */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-500" />
              <CardTitle className="text-base font-semibold">
                Active Access Scopes
              </CardTitle>
            </div>
            <CardDescription>
              System modules locked behind cryptographic board clearance keys.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {permissionScopesData.map((scope: PermissionScope) => (
              <div
                key={scope.id}
                className="space-y-2 rounded-xl border border-slate-100 bg-white p-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {scope.module}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      scope.riskScore === "High"
                        ? "border-rose-300 bg-rose-50 text-[10px] text-rose-700"
                        : scope.riskScore === "Medium"
                          ? "border-amber-300 bg-amber-50 text-[10px] text-amber-700"
                          : "border-slate-200 bg-slate-50 text-[10px] text-slate-600"
                    }
                  >
                    {scope.riskScore} Risk
                  </Badge>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {scope.description}
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] font-medium text-slate-500">
                  <span>Scope Reference: {scope.id}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {scope.totalGrants} Active Grants
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* SECURITY LOG AUDIT BANNER FOOTER */}
      <Card className="border-none bg-slate-900 text-slate-100 shadow-md dark:bg-black/40">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Immutable Security Auditing Protocol Enforced
              </p>
              <p className="text-xs text-slate-400">
                All modifications to board privilege sets are cryptographically
                signed and routed to isolated cloud monitors.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full border-none bg-white text-xs font-semibold text-slate-900 hover:bg-slate-100 sm:w-auto"
          >
            View Audit Crypts
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
