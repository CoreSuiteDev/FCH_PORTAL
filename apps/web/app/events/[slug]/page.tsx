"use client"

import { use, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Wifi,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText
} from "lucide-react"

import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "@workspace/ui/components/sonner"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import Container from "@/components/shared/container"
import { useEventById, useRegisterEvent } from "@/hooks/useEvents"
import { useSessionInfo } from "@/hooks/useUser"

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
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

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50 py-10 md:py-16">
      <Container className="max-w-6xl">
        <Skeleton className="mb-8 h-4 w-48 rounded-sm" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="border border-stone-200 bg-white p-2 shadow-sm rounded-xl">
              <Skeleton className="h-[300px] w-full rounded-lg md:h-[450px]" />
            </div>
            <div className="space-y-4 bg-white p-8 border border-stone-200 shadow-sm rounded-xl">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-10 w-3/4 rounded-md" />
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-8 border border-stone-200 shadow-sm rounded-xl space-y-6">
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = use(params)
  const id = resolvedParams?.slug
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: event, isLoading, isError } = useEventById(id)
  const { data: session } = useSessionInfo()
  const registerMutation = useRegisterEvent()

  const [registering, setRegistering] = useState(false)

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (isError || !event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-stone-50 text-center p-6">
        <AlertCircle className="mb-4 h-12 w-12 text-stone-400 stroke-1" />
        <h2 className="font-trajan text-2xl font-bold text-stone-900 tracking-wide">Event Not Found</h2>
        <p className="mt-4 text-stone-500 max-w-md leading-relaxed">
          The event you are looking for might have been removed or you do not have permission to view it.
        </p>
        <Link href="/events" className="mt-8">
          <Button className="rounded-none bg-stone-900 hover:bg-stone-800 text-white px-8 uppercase tracking-widest text-xs font-semibold">
            Return to Events
          </Button>
        </Link>
      </div>
    )
  }

  const isWebinar = event.eventType === "WEBINAR"
  const isFreeWebinar = event.visibility === "FREE_WEBINAR"
  const isCompleted = event.status === "COMPLETED"
  const isCancelled = event.status === "CANCELLED"

  const isAlreadyRegistered =
    session?.authenticated &&
    event.registrations?.some(
      (r) => r.userId === session?.user?.id && r.status === "CONFIRMED"
    )

  const spotsLeft =
    event.maxCapacity != null
      ? event.maxCapacity - (event.currentCount ?? 0)
      : null
  const isFullyBooked = spotsLeft !== null && spotsLeft <= 0

  const handleRegister = async () => {
    if (!session?.authenticated) {
      toast.info("Please log in to register for this event.")
      router.push(`/login?redirect=/events/${event.id}`)
      return
    }

    setRegistering(true)
    try {
      await registerMutation.mutateAsync(event.id)
      toast.success("Successfully registered for the event!")
      queryClient.invalidateQueries({ queryKey: ["event-detail", event.id] })
    } catch (error) {
      toast.error((error as Error).message || "Failed to register for the event. Please try again.")
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-10 font-sans">
      <Container className="max-w-6xl">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList className="text-xs uppercase tracking-widest text-stone-500">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="hover:text-[#8b1d22] transition-colors">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-stone-300" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/events" className="hover:text-[#8b1d22] transition-colors">
                  Events
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-stone-300" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-stone-950 line-clamp-1 max-w-[240px]">
                {event.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Column: Media & Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Hero Section */}
            <div className="bg-white border border-stone-200 shadow-sm p-2 rounded-xl">
              <div className="relative h-[300px] w-full md:h-[450px] bg-stone-100 overflow-hidden rounded-lg">
                {event.coverImage ? (
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-stone-100">
                    {isWebinar ? (
                      <Video className="h-20 w-20 text-stone-300 stroke-1" />
                    ) : (
                      <Calendar className="h-20 w-20 text-stone-300 stroke-1" />
                    )}
                  </div>
                )}
                
                {/* Badges Overlay */}
                <div className="absolute left-4 top-4 flex gap-2">
                  <span className="inline-flex items-center bg-[#8b1d22] text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                    {event.status}
                  </span>
                  {isWebinar && (
                    <span className="inline-flex items-center gap-1.5 bg-white border border-[#8b1d22]/20 text-[#8b1d22] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                      <Wifi className="h-3 w-3" /> Webinar
                    </span>
                  )}
                  {isFreeWebinar && (
                    <span className="inline-flex items-center bg-[#8b1d22]/10 border border-[#8b1d22]/20 text-[#8b1d22] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                      Complimentary
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Category Area */}
              <div className="p-8 md:px-10 md:py-12 border-t border-stone-100">
                {event.categories.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {event.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="border border-[#8b1d22]/20 bg-[#8b1d22]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8b1d22] rounded-md"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className="font-trajan text-3xl font-medium text-stone-900 md:text-5xl leading-[1.15] tracking-tight">
                  {event.title}
                </h1>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white p-8 md:p-10 border border-stone-200 shadow-sm rounded-xl">
              <h3 className="font-trajan text-xl text-stone-900 mb-6 uppercase tracking-wider flex items-center gap-4">
                About the Event
                <span className="h-0.5 flex-1 bg-[#8b1d22]/10"></span>
              </h3>
              <div className="prose prose-stone max-w-none">
                <p className="text-stone-700 leading-loose text-base md:text-lg font-light whitespace-pre-line">
                  {event.description || "No description provided for this event."}
                </p>
              </div>
            </div>

            {/* Webinar Speakers Card */}
            {isWebinar && event.webinar?.speakers && event.webinar.speakers.length > 0 && (
              <div className="bg-white p-8 md:p-10 border border-stone-200 shadow-sm rounded-xl">
                <h3 className="font-trajan text-xl text-stone-900 mb-6 uppercase tracking-wider flex items-center gap-4">
                  Featured Speakers
                  <span className="h-0.5 flex-1 bg-[#8b1d22]/10"></span>
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {event.webinar.speakers.map((speaker, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border border-stone-200 bg-stone-50/50 rounded-xl"
                    >
                      <div className="flex h-12 w-12 items-center justify-center bg-[#8b1d22]/10 text-[#8b1d22] font-trajan text-lg border border-[#8b1d22]/20 rounded-lg">
                        {speaker.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-stone-900 text-lg">{speaker}</p>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Webinar Host</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Materials Card */}
            {event.materials && event.materials.length > 0 && (
              <div className="bg-white p-8 md:p-10 border border-stone-200 shadow-sm rounded-xl">
                <h3 className="font-trajan text-xl text-stone-900 mb-6 uppercase tracking-wider flex items-center gap-4">
                  Resources & Materials
                  <span className="h-0.5 flex-1 bg-[#8b1d22]/10"></span>
                </h3>
                <div className="space-y-4">
                  {event.materials.map((material) => (
                    <a
                      key={material.id}
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between border border-stone-200 p-5 hover:border-[#8b1d22]/30 hover:bg-[#8b1d22]/5 transition-all group rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center bg-stone-100 text-stone-500 border border-stone-200 group-hover:bg-white rounded-lg">
                          <FileText className="h-5 w-5 stroke-1" />
                        </div>
                        <div>
                          <p className="text-base font-medium text-stone-900 group-hover:text-black">
                            {material.title}
                          </p>
                          <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">
                            {material.fileType} Document
                          </p>
                        </div>
                      </div>
                      <Download className="h-5 w-5 text-stone-400 group-hover:text-[#8b1d22] stroke-1" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Registration Card */}
          <div className="space-y-6">
            <Card className="sticky top-24 border border-stone-200 bg-white p-8 shadow-md rounded-xl">
              <div className="space-y-8">
                <div>
                  <h3 className="font-trajan text-lg text-stone-900 border-b-2 border-[#8b1d22] pb-3 uppercase tracking-wider mb-6">
                    Event Details
                  </h3>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#8b1d22]/5 text-[#8b1d22] border border-[#8b1d22]/10 rounded-lg">
                        <Calendar className="h-5 w-5 stroke-1" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Date</p>
                        <p className="text-sm font-medium text-stone-900">
                          {formatDate(event.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#8b1d22]/5 text-[#8b1d22] border border-[#8b1d22]/10 rounded-lg">
                        <Clock className="h-5 w-5 stroke-1" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Time</p>
                        <p className="text-sm font-medium text-stone-900">
                          {formatTime(event.startDate)}
                          {event.endDate && ` - ${formatTime(event.endDate)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#8b1d22]/5 text-[#8b1d22] border border-[#8b1d22]/10 rounded-lg">
                        <MapPin className="h-5 w-5 stroke-1" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Location</p>
                        <p className="text-sm font-medium text-stone-900 leading-relaxed">
                          {event.location}
                        </p>
                      </div>
                    </div>

                    {event.maxCapacity != null && (
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#8b1d22]/5 text-[#8b1d22] border border-[#8b1d22]/10 rounded-lg">
                          <Users className="h-5 w-5 stroke-1" />
                        </div>
                        <div className="grow">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Capacity</p>
                          <p className="text-sm font-medium text-stone-900 mb-3">
                            {event.currentCount ?? 0} of {event.maxCapacity} seats filled
                          </p>
                          <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#8b1d22] rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (((event.currentCount ?? 0) / event.maxCapacity) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Area */}
                <div className="pt-8 border-t border-stone-200">
                  {isCompleted || isCancelled ? (
                    <div className="bg-stone-50 border border-stone-200 p-6 text-center rounded-xl">
                      <AlertCircle className="mx-auto mb-3 h-6 w-6 text-stone-400 stroke-1" />
                      <p className="text-sm font-bold uppercase tracking-widest text-stone-600">
                        {isCancelled ? "Event Cancelled" : "Registration Closed"}
                      </p>
                      <p className="text-sm text-stone-500 mt-2 font-serif italic">
                        {isCancelled
                          ? "This event has been cancelled by the host."
                          : "This event has already taken place."}
                      </p>
                    </div>
                  ) : isAlreadyRegistered ? (
                    <div className="bg-stone-50 border border-stone-200 p-6 text-center rounded-xl">
                      <CheckCircle className="mx-auto mb-3 h-6 w-6 text-stone-800 stroke-1" />
                      <p className="text-sm font-bold uppercase tracking-widest text-stone-900">Registered</p>
                      <p className="text-sm text-stone-600 mt-2 font-serif italic">
                        Your attendance has been confirmed.
                      </p>
                      {isWebinar && event.meetingLink && (
                        <a
                          href={event.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-[#8b1d22] bg-[#8b1d22] py-4 text-xs uppercase tracking-widest font-bold text-white hover:bg-[#72181c] rounded-xl shadow-md transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" /> Join Webinar
                        </a>
                      )}
                    </div>
                  ) : isFullyBooked ? (
                    <div className="bg-stone-50 border border-stone-200 p-6 text-center rounded-xl">
                      <AlertCircle className="mx-auto mb-3 h-6 w-6 text-stone-600 stroke-1" />
                      <p className="text-sm font-bold uppercase tracking-widest text-stone-800">Fully Booked</p>
                      <p className="text-sm text-stone-600 mt-2 font-serif italic">
                        All seats have been reserved. Registration is closed.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        onClick={handleRegister}
                        disabled={registering}
                        className="w-full rounded-xl bg-[#8b1d22] hover:bg-[#72181c] py-7 text-sm uppercase tracking-widest font-bold shadow-md"
                      >
                        {registering ? "Processing..." : "Reserve a Seat"}
                      </Button>
                      {!session?.authenticated && (
                        <p className="text-center text-xs text-stone-500 font-serif italic">
                          Authentication is required to confirm registration.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}