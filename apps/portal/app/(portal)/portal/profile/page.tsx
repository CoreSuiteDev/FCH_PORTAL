"use client"

import React from "react"
import Link from "next/link"
import {
  IconUser,
  IconInfoCircle,
  IconEdit,
  IconCreditCard,
} from "@tabler/icons-react"
import { useSessionInfo } from "@/hooks/use-session-info"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function ProfilePage() {
  const { data: session, isLoading } = useSessionInfo()

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 lg:col-span-2 rounded-lg" />
        </div>
      </div>
    )
  }

  const user = session?.user

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
          <p className="text-muted-foreground">
            Manage your personal details, membership tier, and billing
            subscriptions.
          </p>
        </div>
      </div>

      {/* Developer Notes / TODO */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
        <div className="flex items-start gap-3">
          <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">
              Developer TODO Checklist:
            </h4>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                Okta Integration: Fetch active user session information
                (first/last name, email, avatar).
              </li>
              <li>
                Self-serve cancellations and subscription details are managed under Billing & Subscriptions.
              </li>
              <li>
                Provide profile update forms: Implement inputs to change
                password or edit user details, sync updates back to Okta user
                meta.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Card */}
        <div className="space-y-4 rounded-lg border bg-card p-6">
          <div className="flex flex-col items-center justify-center border-b pb-4 text-center">
            <div className="mb-3 rounded-full bg-primary/10 p-4 text-primary">
              <IconUser className="size-16" />
            </div>
            <h3 className="text-lg font-bold">{user?.name || "User Name"}</h3>
            <p className="text-sm text-muted-foreground">{user?.email || "user@fch.org"}</p>
            <span className="mt-3 inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500">
              Active Member
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Membership Tier:</span>
              <span className="font-semibold text-primary capitalize">
                {user?.roles?.find((r) => ["PASTORAL", "BOARD", "MEMBER"].includes(r)) || "General Member"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <h4 className="mb-4 text-base font-bold tracking-tight">
              Account Actions
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <button className="flex items-center justify-center gap-2 rounded-md border bg-secondary p-4 text-sm font-semibold transition-colors hover:bg-secondary/80">
                <IconEdit className="size-5 text-muted-foreground" /> Edit
                Profile Details
              </button>
              <Link
                href="/portal/profile/membership"
                className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <IconCreditCard className="size-5" /> Billing & Subscriptions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

