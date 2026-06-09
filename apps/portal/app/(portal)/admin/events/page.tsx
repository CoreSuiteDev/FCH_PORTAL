"use client"

import React, { useState } from "react"
import { useEventStore } from "@/store/use-event-store"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Dialog, DialogContent } from "@workspace/ui/components/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Card } from "@workspace/ui/components/card"
import {
  Eye,
  CalendarDays,
  Users,
  ChevronLeft,
  ChevronRight,
  Info,
  Tag,
} from "lucide-react"

export default function EventsManager() {
  const {
    getFilteredEvents,
    setFilterStatus,
    selectedEvent,
    setSelectedEvent,
    userRole,
    setUserRole,
  } = useEventStore()

  const allEvents = getFilteredEvents()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const totalPages = Math.ceil(allEvents.length / itemsPerPage)
  const paginatedEvents = allEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getBadgeStyle = (clearance: string) => {
    switch (clearance) {
      case "Board":
        return "bg-slate-900 text-white"
      case "Pastoral":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-emerald-100 text-emerald-700"
    }
  }

  return (
    <div className="min-h-screen space-y-8 bg-slate-50/50 p-8">
      <div className="flex items-end justify-between border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Event Registry
          </h2>
          <p className="mt-1 text-slate-500">
            Managing{" "}
            <span className="font-bold text-slate-900">{allEvents.length}</span>{" "}
            active events for{" "}
            <span className="font-bold text-primary">{userRole}</span>.
          </p>
        </div>
        <div className="flex gap-3">
          <Select
            onValueChange={(v: any) => {
              setUserRole(v)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[140px] rounded-xl bg-white">
              <SelectValue placeholder="Role: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Pastoral">Pastoral</SelectItem>
              <SelectItem value="Board">Board</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(v: any) => {
              setFilterStatus(v)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[140px] rounded-xl bg-white">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Ended">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {paginatedEvents.map((event) => (
          <Card
            key={event.id}
            className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <Badge
                className={`${getBadgeStyle(event.minClearance)} rounded-full px-3 text-[10px] font-bold tracking-wider uppercase`}
              >
                {event.minClearance}
              </Badge>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {event.status}
              </span>
            </div>
            <div>
              <h3 className="text-lg leading-tight font-bold text-slate-900">
                {event.name}
              </h3>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" /> {event.date}
              </p>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <div className="rounded-xl bg-slate-50 p-2 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">
                  Attendees
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {event.attendees}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">
                  Registered
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {event.registeredMembers?.length || 0}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full rounded-xl border-slate-200 transition-all hover:bg-primary hover:text-white"
              onClick={() => setSelectedEvent(event)}
            >
              <Eye className="mr-2 h-4 w-4" /> View Details
            </Button>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-4 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-w-sm overflow-hidden rounded-[2rem] border-0 bg-white/95 p-0 shadow-2xl backdrop-blur-2xl">
          <div className="relative bg-primary px-8 pt-10 pb-8 text-center text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
            <h2 className="relative text-2xl font-black tracking-tight text-white">
              {selectedEvent?.name}
            </h2>
            <p className="relative mt-1.5 text-xs font-medium tracking-widest text-white/80 uppercase">
              {selectedEvent?.date}
            </p>
          </div>
          <div className="space-y-6 px-8 py-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                <Users className="mb-2 h-5 w-5 text-primary" />
                <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Attendees
                </div>
                <div className="text-xl font-black text-slate-900">
                  {selectedEvent?.attendees}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                <Tag className="mb-2 h-5 w-5 text-primary" />
                <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Registered
                </div>
                <div className="text-xl font-black text-slate-900">
                  {selectedEvent?.registeredMembers?.length || 0}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                <Info className="h-3.5 w-3.5 text-primary" /> Description
              </h4>
              <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm">
                {selectedEvent?.description}
              </div>
            </div>
            <Button
              className="h-12 w-full rounded-2xl bg-slate-900 text-white shadow-lg transition-all hover:bg-black hover:shadow-xl active:scale-[0.98]"
              onClick={() => setSelectedEvent(null)}
            >
              Close Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
