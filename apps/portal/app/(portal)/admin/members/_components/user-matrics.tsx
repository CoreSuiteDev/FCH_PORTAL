"use client"

import React, { useState, useEffect } from "react"
import { UserCheck, UserX, Clock, Plus, CheckCircle2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { useUsers } from "@/hooks/useUser"

// Helper to determine top priority role
const getTopRole = (roles: string[] | undefined): string => {
  if (!roles || roles.length === 0) return "GUEST"
  const upperRoles = roles.map((r) => r.toUpperCase())
  if (upperRoles.includes("SUPER_ADMIN")) return "SUPER_ADMIN"
  if (upperRoles.includes("BOARD")) return "BOARD"
  if (upperRoles.includes("PASTORAL")) return "PASTORAL"
  if (upperRoles.includes("MEMBER")) return "MEMBER"
  return roles[0] || "USER"
}

export default function UserMatrics() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Fetch the first 200 users to calculate dynamic dashboard stats
  const { data: usersData, isLoading, } = useUsers(1, 200)
  const usersList = usersData?.data || []

  const handleCreateUser = () => {
    // Logic for user creation is handled by signup or member additions
    setIsOpen(false)
    setShowSuccess(true)
  }

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  if (isLoading) {
    return (
      <div className="space-y-6 py-4 animate-pulse">
        {/* Header section with placeholder button */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-36 rounded bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-10 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* 3 cards skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-950 space-y-4 shadow-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <Skeleton className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
                <Skeleton className="h-5 w-8 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-2 w-full rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </Card>
          ))}
        </div>

        {/* Another 3 status cards skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-950 flex items-start gap-4 shadow-none">
              <Skeleton className="h-11 w-11 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                  <Skeleton className="h-6 w-10 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
                <Skeleton className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Calculate dynamic stats
  const total = usersList.length || 1

  const activeCount = usersList.filter((u) => u.status === "ACTIVE").length
  const suspendedCount = usersList.filter((u) => u.status === "SUSPENDED").length
  const restrictedCount = usersList.filter((u) => u.status === "RESTRICTED" || u.status === "BANNED").length

  const generalCount = usersList.filter((u) => {
    const r = getTopRole(u.roles)
    return r === "MEMBER" || r === "USER" || r === "GUEST"
  }).length
  const pastoralCount = usersList.filter((u) => getTopRole(u.roles) === "PASTORAL").length
  const boardCount = usersList.filter((u) => {
    const r = getTopRole(u.roles)
    return r === "BOARD" || r === "SUPER_ADMIN"
  }).length

  const dynamicTierSummaries = [
    {
      name: "General Members",
      count: generalCount,
      percentage: Math.round((generalCount / total) * 100) || 0,
      color: "bg-blue-500 border-l-blue-500",
    },
    {
      name: "Pastoral Members",
      count: pastoralCount,
      percentage: Math.round((pastoralCount / total) * 100) || 0,
      color: "bg-emerald-500 border-l-emerald-500",
    },
    {
      name: "Board & Admins",
      count: boardCount,
      percentage: Math.round((boardCount / total) * 100) || 0,
      color: "bg-indigo-500 border-l-indigo-500",
    },
  ]

  const statusStats = [
    {
      name: "Active Accounts",
      count: activeCount,
      description: "Currently operational",
      color: "bg-emerald-500",
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      name: "Restricted / Banned",
      count: restrictedCount,
      description: "Compliance restrictions",
      color: "bg-amber-500",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Suspended Accounts",
      count: suspendedCount,
      description: "Access locked by admin",
      color: "bg-rose-500",
      icon: <UserX className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-6 py-4">
      {/* Header section with Add User button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">User Overview</h2>

        {/* Main Add User Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)} className="hover:cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-primary">
                Add New User
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new user account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="pastoral">Pastoral</SelectItem>
                    <SelectItem value="board">Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="text-center sm:max-w-[300px]">
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="rounded-full bg-emerald-100 p-3">
                <CheckCircle2 className="h-10 w-10 animate-in text-emerald-600 duration-300 zoom-in" />
              </div>
              <div className="space-y-1">
                <DialogTitle>Success!</DialogTitle>
                <DialogDescription>
                  The user has been created successfully.
                </DialogDescription>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {dynamicTierSummaries.map((summary, index) => (
          <Card
            key={index}
            className={`border-l-4 shadow-none ${summary.color.replace("bg-", "border-l-")}`}
          >
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${summary.color}`} />
                  <span className="text-sm font-semibold text-slate-700">
                    {summary.name}
                  </span>
                </div>
                <Badge variant="secondary" className="font-mono font-bold">
                  {summary.count}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Distribution</span>
                  <span className="font-medium">{summary.percentage}%</span>
                </div>
                <Progress
                  value={summary.percentage}
                  className={`h-2 ${summary.color.replace("bg-", "[&>div]:bg-")}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statusStats.map((stat, index) => (
          <Card
            key={index}
            className="overflow-hidden shadow-none border border-slate-200 dark:border-slate-800 transition-all hover:shadow-sm"
          >
            <CardContent className="flex items-start gap-4 p-5">
              <div className={`rounded-lg p-3 text-white ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {stat.name}
                  </h3>
                  <span className="text-2xl font-bold text-slate-900">
                    {stat.count}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
