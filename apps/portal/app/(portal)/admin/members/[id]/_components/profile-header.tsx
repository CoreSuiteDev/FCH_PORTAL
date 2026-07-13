"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, Phone, Shield, Calendar } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

interface ProfileHeaderProps {
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    image: string | null
    status: string
    createdAt: string
    roles: string[]
  }
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            Active
          </Badge>
        )
      case "SUSPENDED":
        return (
          <Badge className="border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
            Suspended
          </Badge>
        )
      case "RESTRICTED":
      case "BANNED":
        return (
          <Badge className="border-red-200 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400">
            Banned
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/admin/members">
          <Button variant="ghost" className="gap-2 hover:cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> Back to Directory
          </Button>
        </Link>
        <div className="font-mono text-xs text-slate-400">
          Member ID: {user.id}
        </div>
      </div>

      {/* Main Profile Header Card */}
      <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <CardContent className="flex flex-col items-start gap-6 p-6 md:flex-row md:items-center md:p-8">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-2xl font-bold text-slate-600 uppercase shadow-inner dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                fill
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              user.name.substring(0, 2)
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {user.name}
              </h1>
              {getStatusBadge(user.status)}
              {user.roles.map((role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className="border-slate-200 bg-slate-50 font-mono text-[10px] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300"
                >
                  <Shield className="mr-1 inline h-3 w-3" /> {role}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col gap-x-4 gap-y-1 text-sm text-slate-500 sm:flex-row sm:items-center">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-slate-400" /> {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-slate-400" /> {user.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" /> Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
