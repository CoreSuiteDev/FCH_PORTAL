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
  IconFileText,
  IconMapPin,
  IconNews,
  IconShieldCheck,
  IconVideo,
  IconBooks,
  IconSchool,
  IconAward,
  IconBriefcase,
  IconHierarchy,
  IconDashboard,
} from "@tabler/icons-react"
import { useSessionInfo } from "@/hooks/use-session-info"
import { useEventDashboardStats } from "@/hooks/useEvents"
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

// ─── Quick Access Items ───────────────────────────────────────────────────────

const resourcesList = [
  {
    title: "Learning Library",
    description: "Access theological documents, educational materials, and faith formation guides.",
    url: "/resources/learning",
    icon: IconBooks,
    color: "text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-950/20",
  },
  {
    title: "Special Pastoral Resources",
    description: "Browse curated collections for seasonal programs, retreats, and special parish events.",
    url: "/resources/special",
    icon: IconFileText,
    color: "text-sky-600 bg-sky-500/10 dark:text-sky-400 dark:bg-sky-950/20",
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

export default function PastoralOverviewPage() {
  const { data: session, isLoading: isSessionLoading } = useSessionInfo()
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
  const webinarCount = statsData?.webinarCount ?? 0

  const recentNews = newsData?.data ?? []

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Hero Greeting */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-linear-to-br from-rose-500/10 via-card to-card p-8 shadow-xs">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-rose-400/10 blur-3xl" />
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
                  <span className="text-rose-700 dark:text-rose-400">
                    {user?.name?.split(" ")[0] ?? "Pastor"}
                  </span>{" "}
                  👋
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome to your FCH Pastoral Resources &amp; Training dashboard.
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] font-bold text-rose-700 dark:text-rose-450">
              <IconShieldCheck className="size-3.5" />
              Pastoral Resource Access
            </span>
            <span className="text-[10px] text-muted-foreground">
              Level: Full Diocese Access
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Pastoral Modules"
          value={resourcesList.length}
          icon={IconBooks}
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
          icon={IconCheck}
          color="text-emerald-600 bg-emerald-500/10"
          loading={isEventsLoading}
        />
        <StatCard
          label="Webinars &amp; Seminars"
          value={webinarCount}
          icon={IconVideo}
          color="text-sky-600 bg-sky-500/10"
          loading={isEventsLoading}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Side (Quick Access & News) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Access */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Pastoral Resource Center
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {resourcesList.map((res) => {
                const Icon = res.icon
                return (
                  <Link
                    key={res.title}
                    href={res.url}
                    className="group block rounded-2xl border bg-card p-5 shadow-xs transition-all hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${res.color} group-hover:scale-105 transition-transform duration-300`}>
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {res.title}
                        </h4>
                        <p className="truncate text-xs text-muted-foreground mt-0.5">
                          {res.description}
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
