"use client"

import React, { use } from "react"
import { useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconCalendar,
  IconMapPin,
  IconVideo,
  IconUsers,
  IconClock,
  IconCheck,
  IconLink,
  IconLoader,
  IconBook,
  IconDownload,
  IconFileText,
} from "@tabler/icons-react"
import { useSessionInfo } from "@/hooks/use-session-info"
import { useEventById, useRegisterEvent, useCheckinEvent } from "@/hooks/useEvents"
import { toast } from "@workspace/ui/components/sonner"
import { Skeleton } from "@workspace/ui/components/skeleton"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function EventDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const id = resolvedParams.slug
  const router = useRouter()

  const { data: session, isLoading: isSessionLoading } = useSessionInfo()
  const { data: event, isLoading: isEventLoading, error, refetch } = useEventById(id)

  const registerMutation = useRegisterEvent()
  const checkinMutation = useCheckinEvent()

  const [isMutating, setIsMutating] = React.useState(false)

  const getRegistration = (evt: any) => {
    return evt?.registrations && evt.registrations.length > 0 ? evt.registrations[0] : null
  }

  const isRegistered = (evt: any) => {
    const reg = getRegistration(evt)
    return reg ? reg.status === "CONFIRMED" : false
  }

  const isCheckedIn = (evt: any) => {
    const reg = getRegistration(evt)
    return reg ? reg.checkedIn : false
  }

  const handleRegister = async () => {
    if (!event) return
    setIsMutating(true)
    try {
      await registerMutation.mutateAsync(event.id)
      toast.success("Successfully registered!")
      refetch()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsMutating(false)
    }
  }

  const handleCheckIn = async () => {
    if (!event) return
    setIsMutating(true)
    try {
      await checkinMutation.mutateAsync({ id: event.id })
      toast.success("Successfully checked in!")
      refetch()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Check-in failed. Please try again.")
    } finally {
      setIsMutating(false)
    }
  }

  const formatDateRange = (start: Date | string, end?: Date | string | null) => {
    if (!start) return ""
    const startDate = new Date(start)
    const optionsDate: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" }
    const optionsTime: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" }

    const dateStr = startDate.toLocaleDateString("en-US", optionsDate)
    const timeStr = startDate.toLocaleTimeString("en-US", optionsTime)

    if (end) {
      const endDate = new Date(end)
      const endTimeStr = endDate.toLocaleTimeString("en-US", optionsTime)
      return `${dateStr} at ${timeStr} - ${endTimeStr}`
    }

    return `${dateStr} at ${timeStr}`
  }

  if (isSessionLoading || isEventLoading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h3 className="text-xl font-bold">Failed to load event details</h3>
        <p className="text-muted-foreground max-w-md">
          This event may not exist or you may not have permissions to view it.
        </p>
        <button
          onClick={() => router.back()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 animate-fade-in"
        >
          Go Back
        </button>
      </div>
    )
  }

  const registered = isRegistered(event)
  const checkedIn = isCheckedIn(event)
  const isWebinar = event.eventType === "WEBINAR"

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <IconArrowLeft className="size-4" /> Back to List
      </button>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Cover & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="relative overflow-hidden rounded-2xl border bg-card shadow-xs">
            {event.coverImage ? (
              <div className="h-64 w-full overflow-hidden relative">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent" />
              </div>
            ) : (
              <div className={`absolute top-0 left-0 h-1.5 w-full bg-linear-to-r ${
                event.visibility === "PASTORAL_ONLY" 
                  ? "from-amber-500 to-yellow-400" 
                  : "from-primary to-primary/40"
              }`} />
            )}

            <div className="p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {event.visibility}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-xs font-bold text-sky-600">
                  {event.eventType}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {event.title}
              </h1>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="whitespace-pre-line text-sm sm:text-base">
                  {event.description || "No description provided for this event."}
                </p>
              </div>
            </div>
          </div>

          {/* Speakers / Program details */}
          {isWebinar && event.webinar?.speakers && event.webinar.speakers.length > 0 && (
            <div className="rounded-2xl border bg-card p-6 shadow-xs">
              <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
                <IconUsers className="size-5 text-indigo-500" /> Event Speakers
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {event.webinar.speakers.map((speaker: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                    <div className="size-10 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {speaker.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{speaker}</div>
                      <div className="text-[10px] text-muted-foreground">Guest Speaker</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Materials Section (Downloads) */}
          {registered && event.materials && event.materials.length > 0 && (
            <div className="rounded-2xl border bg-card p-6 shadow-xs">
              <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
                <IconFileText className="size-5 text-emerald-500" /> Event Materials
              </h3>
              <div className="divide-y">
                {event.materials.map((mat: any) => (
                  <div key={mat.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                        <IconFileText className="size-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{mat.title}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{mat.fileType}</div>
                      </div>
                    </div>
                    <a
                      href={mat.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      title="Download material"
                    >
                      <IconDownload className="size-5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar metadata & Actions */}
        <div className="space-y-6">
          {/* Action Box */}
          <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold tracking-tight">Registration Status</h3>
            
            <div className="flex flex-col gap-3">
              {checkedIn ? (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs font-bold">
                  <IconCheck className="size-5" /> You have checked in to this event.
                </div>
              ) : registered ? (
                <div className="flex items-center gap-2 text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-xs font-bold">
                  <IconCheck className="size-5" /> You are registered for this event.
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  You are not registered. Register now to reserve your spot and access event materials.
                </div>
              )}

              {!registered ? (
                <button
                  onClick={handleRegister}
                  disabled={isMutating}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-xs transition-all duration-200 hover:bg-primary/95 active:scale-98 disabled:opacity-50"
                >
                  {isMutating ? (
                    <IconLoader className="size-4 animate-spin" />
                  ) : (
                    <IconBook className="size-5" />
                  )}
                  Register Now
                </button>
              ) : !checkedIn ? (
                <button
                  onClick={handleCheckIn}
                  disabled={isMutating}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-xs transition-all duration-200 hover:bg-emerald-500 active:scale-98 disabled:opacity-50"
                >
                  {isMutating ? (
                    <IconLoader className="size-4 animate-spin" />
                  ) : (
                    <IconCheck className="size-5" />
                  )}
                  Check In
                </button>
              ) : isWebinar && event.meetingLink ? (
                <a
                  href={event.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full animate-pulse cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-xs transition-all duration-200 hover:bg-sky-400 hover:shadow-md active:scale-98"
                >
                  <IconLink className="size-5" />
                  Join Webinar (Zoom)
                </a>
              ) : (
                <button
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border bg-muted px-5 py-3 text-sm font-bold text-muted-foreground"
                >
                  <IconCheck className="size-5" /> Attendance Confirmed
                </button>
              )}
            </div>
          </div>

          {/* Details Metadata Box */}
          <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold tracking-tight">Event Details</h3>
            <div className="space-y-4 text-xs text-muted-foreground">
              <div className="flex items-start gap-3">
                <IconClock className="size-5 text-primary shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">Date & Time</div>
                  <div className="mt-1 text-muted-foreground">{formatDateRange(event.startDate, event.endDate)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                {isWebinar ? (
                  <IconVideo className="size-5 text-sky-500 shrink-0" />
                ) : (
                  <IconMapPin className="size-5 text-amber-500 shrink-0" />
                )}
                <div>
                  <div className="font-semibold text-foreground">Location</div>
                  <div className="mt-1 text-muted-foreground">{event.location}</div>
                </div>
              </div>

              {event.maxCapacity && (
                <div className="flex items-start gap-3">
                  <IconUsers className="size-5 text-indigo-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Capacity</div>
                    <div className="mt-1 text-muted-foreground">
                      {event.currentCount || 0} / {event.maxCapacity} spots filled
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
