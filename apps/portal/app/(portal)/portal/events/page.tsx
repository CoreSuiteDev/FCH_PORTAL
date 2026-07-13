"use client"

import React, { useState } from "react"
import { IconLock } from "@tabler/icons-react"
import { useSessionInfo } from "@/hooks/use-session-info"
import { useEventsList, useRegisterEvent, useCheckinEvent } from "@/hooks/useEvents"
import { toast } from "@workspace/ui/components/sonner"

import { EventsHeader } from "./_components/events-header"
import { EventsTabs } from "./_components/events-tabs"
import { EventCard } from "./_components/event-card"
import { LoadingSkeletons } from "./_components/loading-skeletons"
import { EmptyState } from "./_components/empty-state"

export default function EventsPage() {
  const { data: session, isLoading: isSessionLoading } = useSessionInfo()
  const { data: eventsData, isLoading: isEventsLoading, error, refetch } = useEventsList({
    page: 1,
    limit: 50,
  })

  const registerMutation = useRegisterEvent()
  const checkinMutation = useCheckinEvent()

  const [activeTab, setActiveTab] = useState<"all" | "registered">("all")
  const [mutatingId, setMutatingId] = useState<string | null>(null)

  const user = session?.user
  const events = eventsData?.data || []

  // Filter events to only show type: EVENT
  const eventList = events.filter((e: any) => e.eventType === "EVENT")

  // Helpers to check registration and check-in status
  const getRegistration = (event: any) => {
    return event.registrations && event.registrations.length > 0 ? event.registrations[0] : null
  }

  const isRegistered = (event: any) => {
    const reg = getRegistration(event)
    return reg ? reg.status === "CONFIRMED" : false
  }

  const isCheckedIn = (event: any) => {
    const reg = getRegistration(event)
    return reg ? reg.checkedIn : false
  }

  // Filter events based on active tab
  const filteredEvents = eventList.filter((event: any) => {
    if (activeTab === "registered") {
      return isRegistered(event)
    }
    return true
  })

  const handleRegister = async (eventId: string) => {
    setMutatingId(eventId)
    try {
      await registerMutation.mutateAsync(eventId)
      toast.success("Successfully registered for the event!")
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
      const endDate = new Date(end)
      const endTimeStr = endDate.toLocaleTimeString("en-US", optionsTime)
      return `${dateStr} • ${timeStr} - ${endTimeStr}`
    }

    return `${dateStr} • ${timeStr}`
  }

  if (isSessionLoading || isEventsLoading) {
    return <LoadingSkeletons />
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="p-4 bg-destructive/10 text-destructive rounded-full">
          <IconLock className="size-10" />
        </div>
        <h3 className="text-xl font-bold">Failed to load events</h3>
        <p className="text-muted-foreground max-w-md">
          There was an error fetching the event list. Please check your internet connection or try again.
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

  // Stats for Events only
  const totalAvailable = eventList.length
  const registeredCount = eventList.filter(isRegistered).length

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Welcome & Banner */}
      <EventsHeader
        userName={user?.name}
        totalAvailable={totalAvailable}
        registeredCount={registeredCount}
        webinarCount={0} // Only showing events here, webinars count is 0 for this page
      />

      {/* Tabs / Filters */}
      <EventsTabs
        activeTab={activeTab as any}
        setActiveTab={setActiveTab as any}
        registeredCount={registeredCount}
        showWebinarsTab={false}
      />

      {/* Events Listing */}
      {filteredEvents.length === 0 ? (
        <EmptyState activeTab={activeTab} />
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
