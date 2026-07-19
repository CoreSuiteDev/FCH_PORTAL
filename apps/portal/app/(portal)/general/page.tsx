"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import {
  IconArrowRight,
  IconCalendarEvent,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconFileText,
  IconMapPin,
  IconNews,
  IconShieldCheck,
  IconSpeakerphone,
  IconUsers,
  IconVideo,
  IconBook,
} from "@tabler/icons-react"
import { useSessionInfo } from "@/hooks/use-session-info"
import { useEventDashboardStats } from "@/hooks/useEvents"
import { useMyMemberships } from "@/hooks/useMembership"
import { useNewsList } from "@/hooks/useNews"
import { Skeleton } from "@workspace/ui/components/skeleton"

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

function MembershipStatusBadge({
  status,
}: {
  status: string | undefined
}) {
  if (!status) return null
  const map: Record<string, { label: string; cls: string }> = {
    Active: {
      label: "Active",
      cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    },
    Pending: {
      label: "Pending",
      cls: "border-amber-500/30 bg-amber-500/10 text-amber-700",
    },
    Expired: {
      label: "Expired",
      cls: "border-rose-500/30 bg-rose-500/10 text-rose-700",
    },
    Canceled: {
      label: "Canceled",
      cls: "border-slate-400/30 bg-slate-400/10 text-slate-600",
    },
  }
  const cfg = map[status] ?? {
    label: status,
    cls: "border-slate-400/30 bg-slate-400/10 text-slate-600",
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${cfg.cls}`}
    >
      <IconShieldCheck className="size-3" />
      {cfg.label}
    </span>
  )
}

const quickLinks = [
  {
    title: "Events & Webinars",
    href: "/events",
    description: "Register for upcoming summits, workshops and live webinars.",
    icon: IconCalendarEvent,
    color: "text-primary bg-primary/10",
  },
  {
    title: "Announcements",
    href: "/announcements",
    description: "Read latest system notifications and member updates.",
    icon: IconSpeakerphone,
    color: "text-amber-600 bg-amber-500/10",
  },
  {
    title: "Member Resources",
    href: "/resources/member",
    description: "Access templates, learning materials, and member-only documents.",
    icon: IconBook,
    color: "text-emerald-600 bg-emerald-500/10",
  },
  {
    title: "News & Newsletters",
    href: "/news",
    description: "Browse FCH monthly newsletters and community news.",
    icon: IconNews,
    color: "text-sky-600 bg-sky-500/10",
  },
  {
    title: "Account Settings",
    href: "/account",
    description: "Update your personal details, password and preferences.",
    icon: IconUsers,
    color: "text-rose-600 bg-rose-500/10",
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
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
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

      <h4 className="line-clamp-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
        {event.title}
      </h4>

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

export default function PortalDashboardPage() {
  const { data: session, isLoading: isSessionLoading } = useSessionInfo()
  const user = session?.user
  const userId = user?.id ?? ""

  const { data: statsData, isLoading: isEventsLoading } = useEventDashboardStats()

  const { data: memberships, isLoading: isMemberLoading } = useMyMemberships(userId)

  const { data: newsData, isLoading: isNewsLoading } = useNewsList({
    page: 1,
    limit: 4,
    status: "PUBLISHED",
  })

  // Derive stats
  const activeMembership = useMemo(
    () => memberships?.find((m) => m.status === "Active"),
    [memberships]
  )

  const totalEventsCount = statsData?.totalEvents ?? 0
  const upcomingEvents = statsData?.upcomingEvents ?? []
  const registeredCount = statsData?.registeredCount ?? 0
  const checkedInCount = statsData?.checkedInCount ?? 0

  const recentNews = newsData?.data ?? []

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">

      {/* Hero Greeting */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-card to-card p-8 shadow-xs">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
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
                  <span className="text-amber-600 dark:text-amber-400">
                    {user?.name?.split(" ")[0] ?? "Member"}
                  </span>{" "}
                  👋
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back to your FCH Pastoral Member portal.
                </p>
              </>
            )}
          </div>

          {/* Membership badge */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {isMemberLoading ? (
              <Skeleton className="h-8 w-36" />
            ) : activeMembership ? (
              <>
                <MembershipStatusBadge status={activeMembership.status} />
                <span className="text-xs font-semibold text-muted-foreground">
                  {activeMembership.packageName}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Expires {formatDate(activeMembership.expiryDate)}
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">No active membership</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Membership Tier"
          value={activeMembership?.tier ?? "—"}
          icon={IconShieldCheck}
          color="text-amber-600 bg-amber-500/10"
          loading={isMemberLoading}
        />
        <StatCard
          label="Events Available"
          value={totalEventsCount}
          icon={IconCalendarEvent}
          color="text-primary bg-primary/10"
          loading={isEventsLoading}
        />
        <StatCard
          label="Registered"
          value={registeredCount}
          icon={IconUsers}
          color="text-indigo-600 bg-indigo-500/10"
          loading={isEventsLoading}
        />
        <StatCard
          label="Checked In"
          value={checkedInCount}
          icon={IconCheck}
          color="text-emerald-600 bg-emerald-500/10"
          loading={isEventsLoading}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Side (Quick Access & Latest News) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Access */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              General Quick Access
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {quickLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group block rounded-2xl border bg-card p-5 shadow-xs transition-all hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color} group-hover:scale-105 transition-transform duration-300`}>
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="truncate text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      </div>
                      <IconChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Latest News */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Latest Announcements &amp; News
              </h3>
              <Link
                href="/news"
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                View Archive <IconArrowRight className="size-3" />
              </Link>
            </div>

            {isNewsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : recentNews.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground text-sm">
                No recent news or announcements.
              </div>
            ) : (
              <div className="grid gap-4">
                {recentNews.map((news) => (
                  <div
                    key={news.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          News
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(news.createdAt)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground">
                        {news.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {news.content ? news.content.replace(/<[^>]*>/g, "").slice(0, 120) + "..." : ""}
                      </p>
                    </div>
                    <Link
                      href={`/news`}
                      className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold text-foreground hover:bg-muted"
                    >
                      Read Article
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side (Upcoming Events) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Upcoming Events
            </h3>
            <Link
              href="/events"
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              All Events <IconArrowRight className="size-3" />
            </Link>
          </div>

          {isEventsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground text-sm">
              No upcoming events scheduled.
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingEvents.map((ev) => (
                <EventMiniCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
