"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Users, Wifi, ChevronRight, Video } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import Container from "@/components/shared/container"
import { usePublicEvents } from "@/hooks/useEvents"
import { ZTEvent } from "@workspace/types"

type EventStatusKey = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

function formatTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date))
}

// ─── Tab types ───────────────────────────────────────────────────────────────

type TabKey = "ALL" | EventStatusKey

const TABS: { key: TabKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "UPCOMING", label: "Upcoming" },
  { key: "ONGOING", label: "Ongoing" },
  { key: "COMPLETED", label: "Completed" },
]

// ─── Skeleton card ───────────────────────────────────────────────────────────

function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="mt-2 flex flex-col gap-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="mt-3 h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}

function HeroSkeleton() {
  return (
    <div className="mb-10 overflow-hidden rounded-3xl bg-gray-200">
      <Skeleton className="h-[380px] w-full rounded-none" />
    </div>
  )
}

// ─── Event card ──────────────────────────────────────────────────────────────

function EventCard({ event }: { event: ZTEvent }) {
  const isWebinar = event.eventType === "WEBINAR"
  const isFreeWebinar = event.visibility === "FREE_WEBINAR"
  const spotsLeft =
    event.maxCapacity != null
      ? event.maxCapacity - (event.currentCount ?? 0)
      : null

  const statusColor = ({
    UPCOMING: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ONGOING: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-gray-100 text-gray-500 border-gray-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
  } as Record<string, string>)[event.status] || "bg-gray-50 text-gray-500"

  const statusLabel = ({
    UPCOMING: "Upcoming",
    ONGOING: "Live Now",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  } as Record<string, string>)[event.status] || event.status

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_40px_rgba(139,26,26,0.12)]"
    >
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-primary/5">
            {isWebinar ? (
              <Video className="h-12 w-12 text-primary/30" />
            ) : (
              <Calendar className="h-12 w-12 text-primary/30" />
            )}
          </div>
        )}

        {/* Top badges overlay */}
        <div className="absolute left-3 top-3 flex gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}
          >
            {event.status === "ONGOING" && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            )}
            {statusLabel}
          </span>
          {isWebinar && (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
              <Wifi className="h-3 w-3" />
              Webinar
            </span>
          )}
          {isFreeWebinar && !isWebinar && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              Free
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Categories */}
        {event.categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {event.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <h3 className="mb-2 font-trajan text-[1.05rem] font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary line-clamp-2">
          {event.title}
        </h3>

        {event.description && (
          <p className="mb-4 text-sm leading-relaxed text-gray-500 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="mt-auto space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span>
              {formatDate(event.startDate)} · {formatTime(event.startDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          {spotsLeft !== null && (
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>
                {spotsLeft > 0 ? (
                  <>
                    <span className="font-semibold text-gray-700">{spotsLeft}</span>{" "}
                    spots left
                  </>
                ) : (
                  <span className="font-semibold text-red-500">Fully booked</span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-xs font-medium text-primary underline-offset-2 group-hover:underline">
            View Details
          </span>
          <ChevronRight className="h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  )
}

// ─── Featured hero event ─────────────────────────────────────────────────────

function HeroEvent({ event }: { event: ZTEvent }) {
  const isWebinar = event.eventType === "WEBINAR"

  return (
    <Link href={`/events/${event.id}`} className="group mb-10 block">
      <div className="relative overflow-hidden rounded-3xl">
        {/* Image */}
        <div className="relative h-[340px] w-full md:h-[420px]">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              sizes="100vw"
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-primary/80 to-primary/60" />
          )}
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              ⭐ Featured Event
            </span>
            {isWebinar && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Wifi className="h-3 w-3" />
                Free Webinar
              </span>
            )}
          </div>

          <h2 className="mb-2 font-trajan text-2xl font-bold text-white drop-shadow md:text-4xl line-clamp-2">
            {event.title}
          </h2>

          {event.description && (
            <p className="mb-5 max-w-2xl text-sm text-white/80 line-clamp-2 md:text-base">
              {event.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(event.startDate)} · {formatTime(event.startDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </span>
          </div>

          <Button className="mt-5 w-fit rounded-xl bg-white px-7 py-5 font-bold text-primary shadow-lg hover:bg-white/90">
            Register Now
          </Button>
        </div>
      </div>
    </Link>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function EventsList() {
  const [activeTab, setActiveTab] = useState<TabKey>("ALL")
  const { data: eventsRes, isLoading, isError } = usePublicEvents({
    eventType: "EVENT",
  })

  const allPublicEvents = eventsRes?.data ?? []

  // Featured = first UPCOMING or ONGOING event with cover image
  const featuredEvent =
    allPublicEvents.find(
      (e) =>
        (e.status === "UPCOMING" || e.status === "ONGOING") && e.coverImage
    ) ?? allPublicEvents[0]

  const filteredEvents =
    activeTab === "ALL"
      ? allPublicEvents
      : allPublicEvents.filter((e) => e.status === activeTab)

  const tabCounts = TABS.reduce(
    (acc, tab) => {
      acc[tab.key] =
        tab.key === "ALL"
          ? allPublicEvents.length
          : allPublicEvents.filter((e) => e.status === tab.key).length
      return acc
    },
    {} as Record<TabKey, number>
  )

  return (
    <section className="min-h-screen bg-white">
      <Container className="py-10 md:py-14">

        {/* ── Hero / Featured ── */}
        {isLoading ? (
          <HeroSkeleton />
        ) : featuredEvent ? (
          <HeroEvent event={featuredEvent} />
        ) : null}

        {/* ── Section header ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-trajan text-2xl font-extrabold text-primary md:text-4xl">
              Events & Webinars
            </h2>
            {!isLoading && (
              <p className="mt-1 text-sm text-gray-400">
                {allPublicEvents.length} public event
                {allPublicEvents.length !== 1 ? "s" : ""} available
              </p>
            )}
          </div>

          {/* ── Tabs ── */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeTab === tab.key
                      ? "bg-white/25 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {tabCounts[tab.key] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-20 text-center">
            <p className="text-lg font-semibold text-red-500">
              Failed to load events
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Please check your connection and try again.
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 py-20 text-center">
            <Calendar className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-lg font-semibold text-gray-500">
              No {activeTab === "ALL" ? "" : activeTab.toLowerCase() + " "}events
              found
            </p>
            <p className="mt-1 text-sm text-gray-400">Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
