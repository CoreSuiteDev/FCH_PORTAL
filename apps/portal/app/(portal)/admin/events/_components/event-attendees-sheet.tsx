"use client"

import { useState, useMemo } from "react"
import {
  CheckCircle2,
  Circle,
  Loader2,
  Search,
  UserCheck,
  Users,
  X,
  Mail,
  CalendarClock,
} from "lucide-react"
import { toast } from "@workspace/ui/components/sonner"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@workspace/ui/components/sheet"
import {
  useEventRegistrations,
  useAdminCheckinUser,
  type EventRegistrant,
} from "@/hooks/useEvents"
import type { ZTEvent } from "@workspace/types"
import Image from "next/image"

interface EventAttendeesSheetProps {
  event: ZTEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getInitials(name: string | null | undefined) {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function formatRegisteredAt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function EventAttendeesSheet({
  event,
  open,
  onOpenChange,
}: EventAttendeesSheetProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"ALL" | "CHECKED_IN" | "NOT_CHECKED_IN">("ALL")
  const [checkingInId, setCheckingInId] = useState<string | null>(null)

  const { data: registrations, isLoading } = useEventRegistrations(
    open && event ? event.id : null
  )
  const checkinMutation = useAdminCheckinUser()

  const stats = useMemo(() => {
    const all = registrations || []
    return {
      total: all.length,
      checkedIn: all.filter((r) => r.checkedIn).length,
    }
  }, [registrations])

  const filtered = useMemo(() => {
    const all = registrations || []
    return all.filter((r) => {
      const matchesSearch =
        !search ||
        r.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.user.email?.toLowerCase().includes(search.toLowerCase())

      const matchesFilter =
        filter === "ALL" ||
        (filter === "CHECKED_IN" && r.checkedIn) ||
        (filter === "NOT_CHECKED_IN" && !r.checkedIn)

      return matchesSearch && matchesFilter
    })
  }, [registrations, search, filter])

  const handleCheckin = async (registrant: EventRegistrant) => {
    if (!event) return
    setCheckingInId(registrant.id)
    try {
      await checkinMutation.mutateAsync({
        eventId: event.id,
        userId: registrant.userId,
      })
      toast.success(`${registrant.user.name || "User"} checked in successfully`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to check in user")
    } finally {
      setCheckingInId(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-xl"
      >
        {/* Header */}
        <SheetHeader className="border-b px-6 py-5">
          <div className="space-y-1">
            <SheetTitle className="text-lg font-bold leading-tight">
              Event Attendees
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground line-clamp-1">
              {event?.title}
            </SheetDescription>
          </div>

          {/* Stats Row */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center rounded-xl border bg-muted/40 px-3 py-2.5">
              <span className="text-xs font-semibold text-muted-foreground">Total</span>
              <span className="text-xl font-extrabold text-foreground">
                {isLoading ? "—" : stats.total}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Checked In
              </span>
              <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {isLoading ? "—" : stats.checkedIn}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Not Checked In
              </span>
              <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400">
                {isLoading ? "—" : stats.total - stats.checkedIn}
              </span>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8 text-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex gap-1.5">
              {(["ALL", "CHECKED_IN", "NOT_CHECKED_IN"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer ${
                    filter === f
                      ? f === "CHECKED_IN"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                        : f === "NOT_CHECKED_IN"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                        : "border-primary/30 bg-primary/10 text-primary"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f === "ALL" ? "All" : f === "CHECKED_IN" ? "✓ Checked In" : "Not Checked"}
                </button>
              ))}
            </div>
          </div>
        </SheetHeader>

        {/* Attendee List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading attendees...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-muted/40">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">No attendees found</p>
              <p className="text-xs text-muted-foreground">
                {search
                  ? "Try a different search term."
                  : "No registrations yet for this event."}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 px-6 py-4 transition-colors ${
                    r.checkedIn
                      ? "bg-emerald-500/5 hover:bg-emerald-500/10"
                      : "hover:bg-muted/40"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {r.user.image ? (
                      <Image
                        src={r.user.image}
                        alt={r.user.name || ""}
                        fill
                        className="h-10 w-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-primary/10 text-xs font-bold text-primary">
                        {getInitials(r.user.name)}
                      </div>
                    )}
                    {r.checkedIn && (
                      <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-emerald-500">
                        <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {r.user.name || "Unknown User"}
                      </span>
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[9px] font-bold py-0 px-1.5 ${
                          r.status === "CONFIRMED"
                            ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-600"
                            : r.status === "CANCELLED"
                            ? "border-rose-500/20 bg-rose-500/10 text-rose-600"
                            : "border-amber-500/20 bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {r.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <span className="truncate text-[11px] text-muted-foreground">
                        {r.user.email || "No email"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CalendarClock className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        Registered: {formatRegisteredAt(r.registeredAt)}
                      </span>
                    </div>
                  </div>

                  {/* Check-in Action */}
                  <div className="shrink-0">
                    {r.checkedIn ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Checked In
                      </span>
                    ) : r.status === "CONFIRMED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 cursor-pointer gap-1.5 border-emerald-500/30 bg-emerald-500/5 px-2.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-500/15 hover:border-emerald-500/50"
                        disabled={checkingInId === r.id}
                        onClick={() => handleCheckin(r)}
                      >
                        {checkingInId === r.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <UserCheck className="h-3 w-3" />
                        )}
                        Check In
                      </Button>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                        <Circle className="h-3 w-3" />
                        {r.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 text-center text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {registrations?.length ?? 0}
          </span>{" "}
          registrations
        </div>
      </SheetContent>
    </Sheet>
  )
}
