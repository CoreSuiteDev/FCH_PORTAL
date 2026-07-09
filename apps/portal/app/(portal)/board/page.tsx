"use client"
import { useBoardStore } from "@/store/bord-overview-store"
import {
  IconArrowRight,
  IconCalendarEvent,
  IconFileReport,
  IconGavel,
  IconDatabase,
} from "@tabler/icons-react"
import Link from "next/link"

export default function ProfessionalBoardPortal() {
  const { pendingVotes } = useBoardStore()

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Page Header with Status */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Board Member Dashboard
          </h2>
          <p className="mt-1 text-muted-foreground">
            Governance, Oversight, and Strategic Decision Support for FCH
            Leadership.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            System Status: Encrypted & Secure
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <KPICard
          title="Upcoming Meeting"
          value="June 25, 2026"
          sub="10:00 AM - Boardroom A"
          icon={<IconCalendarEvent />}
        />
        <KPICard
          title="Pending Resolutions"
          value={pendingVotes.toString()}
          sub="Action Required"
          icon={<IconGavel />}
          className="border-red-200 bg-red-50/50"
        />
        <KPICard
          title="New Docs (7 Days)"
          value="12"
          sub="Financial & Audit Logs"
          icon={<IconFileReport />}
        />
        <KPICard
          title="Compliance Status"
          value="Compliant"
          sub="All filings updated"
          icon={<IconDatabase />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Essential Links */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-2">
          <ResourceLink
            title="Board Materials"
            desc="Agendas, Minutes, and Board Packs for upcoming sessions."
            icon={<IconFileReport />}
          />
          <ResourceLink
            title="Governance & Policy"
            desc="Bylaws, Charter documents, and organizational policies."
            icon={<IconGavel />}
          />
          <ResourceLink
            title="Financial Oversight"
            desc="Monthly balance sheets, audit trails, and treasury reports."
            icon={<IconDatabase />}
          />
          <ResourceLink
            title="Voting Center"
            desc="Active resolutions requiring your digital signature."
            icon={<IconGavel />}
          />
        </div>

        {/* Right Column: Recent Activity / Notifications */}
        <div className="rounded-xl border bg-muted/30 p-6">
          <h3 className="mb-4 font-semibold">Recent Notifications</h3>
          <div className="space-y-4">
            <NotificationItem
              title="Q2 Financial Audit Uploaded"
              time="2 hours ago"
            />
            <NotificationItem
              title="New Policy Proposal: Membership"
              time="1 day ago"
            />
            <NotificationItem
              title="Bylaw Amendment Vote Initiated"
              time="3 days ago"
            />
          </div>
          <button className="mt-6 w-full rounded-lg border py-2 text-sm font-medium transition-colors hover:bg-white">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  )
}

function KPICard({ title, value, sub, icon, className = "" }: any) {
  return (
    <div className={`rounded-xl border bg-card p-4 shadow-sm ${className}`}>
      <div className="mb-2 flex items-start justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase">
          {title}
        </span>
        <div className="text-primary">{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

function ResourceLink({ title, desc, icon }: any) {
  return (
    <Link
      href="#"
      className="group rounded-xl border bg-card p-5 transition-all hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-lg bg-primary/1010 p-2 text-primary">{icon}</div>
        <h4 className="font-semibold">{title}</h4>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{desc}</p>
      <div className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
        ACCESS MODULE <IconArrowRight className="size-3" />
      </div>
    </Link>
  )
}

function NotificationItem({ title, time }: { title: string; time: string }) {
  return (
    <div className="border-b pb-3 last:border-0 last:pb-0">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  )
}
