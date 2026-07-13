"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { IconCalendarOff, IconLock, IconVideo, IconCalendarEvent } from "@tabler/icons-react"
import { useSessionInfo } from "@/hooks/use-session-info"
import { useEventsList, useEventCategories, useRegisterEvent, useCheckinEvent } from "@/hooks/useEvents"
import { toast } from "@workspace/ui/components/sonner"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { LoadingSkeletons } from "./_components/loading-skeletons"
import { EventCard } from "./_components/event-card"

export default function EventsPage() {
  const { data: session, isLoading: isSessionLoading } = useSessionInfo()
  const { data: eventsData, isLoading: isEventsLoading, error, refetch } = useEventsList({ page: 1, limit: 100 })
  const { data: categoriesData, isLoading: isCategoriesLoading } = useEventCategories()

  const registerMutation = useRegisterEvent()
  const checkinMutation = useCheckinEvent()

  const [activeCategoryId, setActiveCategoryId] = useState<string>("all")
  const [mutatingId, setMutatingId] = useState<string | null>(null)

  const user = session?.user
  const allEvents = eventsData?.data || []
  const categories = categoriesData || []

  // Helpers
  const getRegistration = (event: any) =>
    event.registrations?.length > 0 ? event.registrations[0] : null

  const isRegistered = (event: any) => {
    const reg = getRegistration(event)
    return reg ? reg.status === "CONFIRMED" : false
  }

  const isCheckedIn = (event: any) => {
    const reg = getRegistration(event)
    return reg ? reg.checkedIn : false
  }

  // Filter by selected category tab
  const filteredEvents = useMemo(() => {
    if (activeCategoryId === "all") return allEvents
    return allEvents.filter((ev: any) =>
      ev.categories?.some((c: any) => c.id === activeCategoryId)
    )
  }, [allEvents, activeCategoryId])

  const handleRegister = async (eventId: string) => {
    setMutatingId(eventId)
    try {
      await registerMutation.mutateAsync(eventId)
      toast.success("Successfully registered!")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to register. Please try again.")
    } finally {
      setMutatingId(null)
    }
  }

  const handleCheckIn = async (eventId: string) => {
    setMutatingId(eventId)
    try {
      await checkinMutation.mutateAsync({ id: eventId })
      toast.success("Successfully checked in!")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to check in. Please try again.")
    } finally {
      setMutatingId(null)
    }
  }

  const formatDateRange = (start: Date | string, end?: Date | string | null) => {
    const startDate = new Date(start)
    const optionsDate: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
    const optionsTime: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" }
    const dateStr = startDate.toLocaleDateString("en-US", optionsDate)
    const timeStr = startDate.toLocaleTimeString("en-US", optionsTime)
    if (end) {
      const endTimeStr = new Date(end).toLocaleTimeString("en-US", optionsTime)
      return `${dateStr} • ${timeStr} - ${endTimeStr}`
    }
    return `${dateStr} • ${timeStr}`
  }

  const isLoading = isSessionLoading || isEventsLoading || isCategoriesLoading

  if (isLoading) return <LoadingSkeletons />

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="p-4 bg-destructive/10 text-destructive rounded-full">
          <IconLock className="size-10" />
        </div>
        <h3 className="text-xl font-bold">Failed to load events</h3>
        <p className="text-muted-foreground max-w-md">
          There was an error fetching events. Please check your connection or try again.
        </p>
        <button
          onClick={() => refetch()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/95"
        >
          Retry
        </button>
      </div>
    )
  }

  const totalEvents = allEvents.filter((e: any) => e.eventType === "EVENT").length
  const totalWebinars = allEvents.filter((e: any) => e.eventType === "WEBINAR").length

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Events & Webinars
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome{user?.name ? `, ${user.name}` : ""}! Browse upcoming events and webinars available to you.
        </p>
        <div className="flex gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <IconCalendarEvent className="size-4 text-primary" />
            <span><strong className="text-foreground">{totalEvents}</strong> Events</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <IconVideo className="size-4 text-sky-500" />
            <span><strong className="text-foreground">{totalWebinars}</strong> Webinars</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategoryId} onValueChange={setActiveCategoryId} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/60 border p-1 rounded-xl w-fit">
          <TabsTrigger value="all" className="text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer">
            All
          </TabsTrigger>
          {categories.map((cat: any) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
            >
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-muted/40">
            <IconCalendarOff className="size-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">No events found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              There are no events in this category yet. Check back soon!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event: any) => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={isRegistered(event)}
              isCheckedIn={isCheckedIn(event)}
              isMutating={mutatingId === event.id}
              handleRegister={handleRegister}
              handleCheckIn={handleCheckIn}
              formatDateRange={formatDateRange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
