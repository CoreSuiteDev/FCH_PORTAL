"use client"

import { ArrowRight, Calendar, MapPin, Users, Video, Wifi } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import React from "react"

import Container from "@/components/shared/container"
import { usePublicEvents } from "@/hooks/useEvents"
import { Button } from "@workspace/ui/components/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { Skeleton } from "@workspace/ui/components/skeleton"

// ─── Helpers ────────────────────────────────────────────────────────────────

const PUBLIC_VISIBILITIES = ["PUBLIC", "FREE_WEBINAR"] as const

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

// ─── Skeletons ──────────────────────────────────────────────────────────────

function WebinarCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white p-0 shadow-sm">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="space-y-4 p-6">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}

function HeroSkeleton() {
  return (
    <div className="mb-12 overflow-hidden rounded-3xl bg-gray-100">
      <Skeleton className="h-[400px] w-full rounded-none" />
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function UpcomingWebinars() {
  const t = useTranslations("webinarsPage")
  const upcomingHeading = t("upcoming.heading")
  const pastHeading = t("past.heading")
  const viewDetailsText = t("upcoming.viewDetails")
  const footerText = t("footer.text")
  const footerButtonText = t("footer.button")

  const { data: eventsRes, isLoading, isError } = usePublicEvents({
    eventType: "WEBINAR",
  })

  const allWebinars = eventsRes?.data ?? []

  const upcomingWebinars = allWebinars.filter(
    (w) => w.status === "UPCOMING" || w.status === "ONGOING"
  )
  const pastWebinars = allWebinars.filter((w) => w.status === "COMPLETED")

  const featuredWebinar = upcomingWebinars[0]
  const restWebinars = upcomingWebinars

  const [currentPage, setCurrentPage] = React.useState(1)
  const pastLimit = 6
  const totalPages = Math.ceil(pastWebinars.length / pastLimit)
  const startIndex = (currentPage - 1) * pastLimit
  const paginatedPastWebinars = pastWebinars.slice(
    startIndex,
    startIndex + pastLimit
  )

  return (
    <section className="bg-white py-16">
      <Container>
        <h2 className="mb-10 font-trajan text-2xl font-extrabold text-primary md:text-4xl">
          {upcomingHeading}
        </h2>

        {/* ── Loading State ── */}
        {isLoading ? (
          <div className="space-y-12">
            <HeroSkeleton />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <WebinarCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16 text-center">
            <p className="text-lg font-semibold text-red-500">
              Failed to load webinars
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Please check your connection and try again.
            </p>
          </div>
        ) : allWebinars.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 py-20 text-center">
            <Video className="mb-3 h-10 w-10 stroke-1 text-stone-300" />
            <p className="text-lg font-semibold text-stone-500">
              No webinars scheduled
            </p>
            <p className="mt-1 text-sm text-stone-400">
              Check back later for updates.
            </p>
          </div>
        ) : (
          <>
            {/* ── Featured Webinar Banner ── */}
            {featuredWebinar && (
              <Link
                href={`/webinars/${featuredWebinar.id}`}
                className="group relative mb-12 block h-[400px] w-full overflow-hidden rounded-3xl border border-stone-100 shadow-sm"
              >
                {featuredWebinar.coverImage ? (
                  <Image
                    src={featuredWebinar.coverImage}
                    alt={featuredWebinar.title}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#8b1d22] to-[#72181c]">
                    <Wifi className="h-24 w-24 text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

                <div className="absolute bottom-0 p-8 text-white md:p-10">
                  <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold tracking-widest text-white uppercase shadow-sm">
                    <Wifi className="h-3.5 w-3.5" /> Featured Webinar
                  </span>
                  <h1 className="font-trajan text-2xl font-bold uppercase drop-shadow md:text-4xl">
                    {featuredWebinar.title}
                  </h1>
                  {featuredWebinar.description && (
                    <p className="mt-3 line-clamp-2 max-w-2xl text-sm font-light text-white/80 md:text-base">
                      {featuredWebinar.description}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/85">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(featuredWebinar.startDate)} ·{" "}
                      {formatTime(featuredWebinar.startDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {featuredWebinar.location}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* ── Upcoming Webinars Grid ── */}
            {restWebinars.length > 0 && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {restWebinars.map((item) => (
                  <Link
                    key={item.id}
                    href={`/webinars/${item.id}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_40px_rgba(139,26,26,0.12)]"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-stone-50">
                      {item.coverImage ? (
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-primary/5">
                          <Video className="h-12 w-12 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold tracking-widest text-white uppercase ${
                            item.status === "UPCOMING"
                              ? "bg-emerald-600"
                              : item.status === "ONGOING"
                                ? "bg-blue-600"
                                : "bg-stone-500"
                          }`}
                        >
                          {item.status === "ONGOING" && (
                            <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                          )}
                          {item.status === "ONGOING"
                            ? "Live Now"
                            : item.status === "UPCOMING"
                              ? "Upcoming"
                              : "Completed"}
                        </span>
                        {item.visibility === "FREE_WEBINAR" && (
                          <span className="inline-flex items-center rounded-md border border-[#8b1d22]/20 bg-white px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#8b1d22] uppercase shadow-sm">
                            Complimentary
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="mb-3 line-clamp-2 font-trajan text-lg font-bold text-stone-900 transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>

                      <div className="mt-auto mb-6 space-y-2.5 text-xs text-stone-500">
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-primary" />
                          {formatDate(item.startDate)} ·{" "}
                          {formatTime(item.startDate)}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-primary" />
                          <span className="line-clamp-1">{item.location}</span>
                        </p>
                        {item.maxCapacity && (
                          <p className="flex items-center gap-2">
                            <Users className="h-4 w-4 shrink-0 text-primary" />
                            Capacity: {item.maxCapacity} seats
                          </p>
                        )}
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
                        <span className="text-xs font-semibold tracking-wider text-primary uppercase group-hover:underline">
                          {viewDetailsText}
                        </span>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* ── View More Action button ── */}
            {upcomingWebinars.length === 0 && (
              <div className="my-6 flex flex-col items-center justify-center rounded-2xl border border-stone-100 bg-stone-50 p-8 text-center">
                <p className="font-serif text-sm text-stone-500 italic">
                  No upcoming webinars at this moment.
                </p>
              </div>
            )}

            {/* ── Past Webinars Section ── */}
            {pastWebinars.length > 0 && (
              <div className="mt-20 border-t border-stone-200 pt-16">
                <h2 className="mb-10 font-trajan text-2xl font-bold text-stone-900 md:text-4xl">
                  {pastHeading}
                </h2>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedPastWebinars.map((item) => (
                    <Link
                      key={item.id}
                      href={`/webinars/${item.id}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_40px_rgba(139,26,26,0.12)]"
                    >
                      <div className="relative h-52 w-full overflow-hidden bg-stone-50">
                        {item.coverImage ? (
                          <Image
                            src={item.coverImage}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-stone-100">
                            <Video className="h-12 w-12 text-stone-300" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="inline-flex items-center rounded-md border border-stone-200 bg-stone-100 px-2.5 py-1 text-[10px] font-bold tracking-widest text-stone-600 uppercase">
                            Completed
                          </span>
                          {item.visibility === "FREE_WEBINAR" && (
                            <span className="inline-flex items-center rounded-md border border-[#8b1d22]/20 bg-white px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#8b1d22] uppercase shadow-sm">
                              Complimentary
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-3 line-clamp-2 font-trajan text-lg font-bold text-stone-900 transition-colors group-hover:text-primary">
                          {item.title}
                        </h3>

                        <div className="mt-auto mb-6 space-y-2.5 text-xs text-stone-500">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 shrink-0 text-primary" />
                            {formatDate(item.startDate)} ·{" "}
                            {formatTime(item.startDate)}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 shrink-0 text-primary" />
                            <span className="line-clamp-1">
                              {item.location}
                            </span>
                          </p>
                        </div>

                        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
                          <span className="text-xs font-semibold tracking-wider text-primary uppercase group-hover:underline">
                            View Materials
                          </span>
                          <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* ── Pagination Controls ── */}
                {totalPages > 1 && (
                  <Pagination className="mt-12">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) setCurrentPage(currentPage - 1)
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={page === currentPage}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(page)
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages)
                              setCurrentPage(currentPage + 1)
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Footer CTA ── */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-stone-200 pt-10 sm:flex-row">
          <p className="max-w-xl text-sm leading-relaxed font-light text-stone-500">
            {footerText}
          </p>
          <Link href="/membership">
            <Button className="rounded-xl bg-primary px-6 py-6 text-sm font-semibold tracking-wider uppercase shadow-md hover:bg-[#72181c]">
              {footerButtonText}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
