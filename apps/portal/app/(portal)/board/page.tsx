"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import {
  IconArrowRight,
  IconBook,
  IconCalendarEvent,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconDatabase,
  IconFileReport,
  IconFileText,
  IconGavel,
  IconMapPin,
  IconNews,
  IconScale,
  IconShieldCheck,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react"
import { useSessionInfo } from "@/hooks/use-session-info"
import { useEventDashboardStats } from "@/hooks/useEvents"
import { useNewsList } from "@/hooks/useNews"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { useBoardStore } from "@/store/bord-overview-store"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

// ─── Quick Access Items ───────────────────────────────────────────────────────

const quickLinks = [
  {
    title: "Board Materials",
    href: "/board/meetings",
    description: "Agendas, minutes, board packs and session documents.",
    icon: IconFileReport,
    color: "text-primary bg-primary/10",
  },
  {
    title: "Governance & Policy",
    href: "/board/documents",
    description: "Bylaws, charter documents and organisational policies.",
    icon: IconGavel,
    color: "text-amber-600 bg-amber-500/10",
  },
  {
    title: "Financial Oversight",
    href: "/board/financials",
    description: "Monthly balance sheets, audit trails and treasury reports.",
    icon: IconDatabase,
    color: "text-emerald-600 bg-emerald-500/10",
  },
  {
    title: "Voting Center",
    href: "/board/meetings",
    description: "Active resolutions requiring your digital signature.",
    icon: IconScale,
    color: "text-rose-600 bg-rose-500/10",
  },
  {
    title: "Resource Library",
    href: "/resources/board",
    description: "Executive handbooks, templates and reference files.",
    icon: IconBook,
    color: "text-violet-600 bg-violet-500/10",
  },
  {
    title: "News & Newsletters",
    href: "/news",
    description: "Browse FCH monthly newsletters and community news.",
    icon: IconNews,
    color: "text-sky-600 bg-sky-500/10",
  },
  {
    title: "Documents",
    href: "/board/documents",
    description: "Access filed reports, compliance documents and memos.",
    icon: IconFileText,
    color: "text-indigo-600 bg-indigo-500/10",
  },
  {
    title: "Member Directory",
    href: "/account",
    description: "View board roster, pastoral and general member profiles.",
    icon: IconUsers,
    color: "text-teal-600 bg-teal-500/10",
  },
]

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  loading?: boolean
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-xs">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-muted-foreground">
          {label}
        </div>
        {loading ? (
          <Skeleton className="mt-1 h-7 w-10" />
        ) : (
          <div className="text-2xl font-extrabold text-foreground">{value}</div>
        )}
      </div>
    </div>
  )
}

// ─── Event Mini-Card ──────────────────────────────────────────────────────────

function EventMiniCard({ event }: { event: any }) {
  const isWebinar = event.eventType === "WEBINAR"
  const reg = event.registrations?.[0] ?? null
  const registered = reg?.status === "CONFIRMED"
  const checkedIn = reg?.checkedIn ?? false
  const href = `/events/${event.id}`

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-xs transition-all hover:border-primary/30 hover:shadow-md"
    >
      {/* Top badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${
            isWebinar
              ? "border-sky-500/20 bg-sky-500/10 text-sky-600"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
          }`}
        >
          {isWebinar ? (
            <IconVideo className="size-2.5" />
          ) : (
            <IconCalendarEvent className="size-2.5" />
          )}
          {isWebinar ? "Webinar" : "Event"}
        </span>
        {checkedIn ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
            <IconCheck className="size-2.5" /> Checked In
          </span>
        ) : registered ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[9px] font-bold text-indigo-700">
            <IconCheck className="size-2.5" /> Registered
          </span>
        ) : null}
      </div>

      {/* Title */}
      <h4 className="line-clamp-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
        {event.title}
      </h4>

      {/* Meta */}
      <div className="space-y-1 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <IconClock className="size-3.5 shrink-0 text-primary" />
          <span>{formatDate(event.startDate)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isWebinar ? (
            <IconVideo className="size-3.5 shrink-0 text-sky-500" />
          ) : (
            <IconMapPin className="size-3.5 shrink-0 text-amber-500" />
          )}
          <span className="truncate">{event.location}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
        View Details
        <IconChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BoardDashboardPage() {
  const { data: session, isLoading: isSessionLoading } = useSessionInfo()
  const { pendingVotes, nextMeeting } = useBoardStore()
  const user = session?.user

  const { data: statsData, isLoading: isEventsLoading } = useEventDashboardStats()

  const { data: newsData, isLoading: isNewsLoading } = useNewsList({
    page: 1,
    limit: 4,
    status: "PUBLISHED",
  })

  const totalEventsCount = statsData?.totalEvents ?? 0
  const upcomingEvents = statsData?.upcomingEvents ?? []
  const registeredCount = statsData?.registeredCount ?? 0

  const recentNews = newsData?.data ?? []

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">

      {/* ── Hero Greeting ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/10 via-card to-card p-8 shadow-xs">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            {isSessionLoading ? (
              <>
                <Skeleton className="h-9 w-72" />
                <Skeleton className="h-4 w-56" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {getGreeting()},{" "}
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {user?.name?.split(" ")[0] ?? "Member"}
                  </span>{" "}
                  👋
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back to your FCH Board Member governance portal.
                </p>
              </>
            )}
          </div>

          {/* Board status badge */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-400">
              <IconShieldCheck className="size-3.5" />
              Board Member
            </span>
            <span className="text-[10px] text-muted-foreground">
              System Status: Encrypted &amp; Secure
            </span>
            {nextMeeting && (
              <span className="text-[10px] font-semibold text-muted-foreground">
                Next meeting: {nextMeeting}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Pending Resolutions"
          value={pendingVotes}
          icon={IconGavel}
          color="text-rose-600 bg-rose-500/10"
        />
        <StatCard
          label="Events Available"
          value={totalEventsCount}
          icon={IconCalendarEvent}
          color="text-primary bg-primary/10"
          loading={isEventsLoading}
        />
        <StatCard
          label="Registered Events"
          value={registeredCount}
          icon={IconUsers}
          color="text-indigo-600 bg-indigo-500/10"
          loading={isEventsLoading}
        />
        <StatCard
          label="Compliance Status"
          value="Compliant"
          icon={IconShieldCheck}
          color="text-emerald-600 bg-emerald-500/10"
        />
      </div>

      {/* ── Upcoming Events ────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-foreground">
            Upcoming Events &amp; Webinars
          </h2>
          <Link
            href="/events"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View all <IconArrowRight className="size-3" />
          </Link>
        </div>

        {isEventsLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-16 text-center">
            <IconCalendarEvent className="size-10 text-muted-foreground/40" />
            <p className="text-sm font-semibold text-muted-foreground">
              No upcoming events right now.
            </p>
            <p className="text-xs text-muted-foreground">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventMiniCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Access + Latest News ─────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Quick Access */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-extrabold tracking-tight text-foreground">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href + item.title}
                  href={item.href}
                  className="group flex items-start gap-3.5 rounded-2xl border bg-card p-4 shadow-xs transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                        {item.title}
                      </span>
                      <IconChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Latest News */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-foreground">
              Latest News
            </h2>
            <Link
              href="/news"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              All news <IconArrowRight className="size-3" />
            </Link>
          </div>

          <div className="rounded-2xl border bg-card shadow-xs divide-y overflow-hidden">
            {isNewsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-4 space-y-1.5">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : recentNews.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <IconNews className="size-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">No news yet.</p>
              </div>
            ) : (
              recentNews.map((item) => (
                <Link
                  key={item.id}
                  href="/news"
                  className="group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/40"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                    <IconNews className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-semibold text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {item.publishedAt ? formatDate(item.publishedAt) : "Draft"}
                    </p>
                  </div>
                  <IconChevronRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
