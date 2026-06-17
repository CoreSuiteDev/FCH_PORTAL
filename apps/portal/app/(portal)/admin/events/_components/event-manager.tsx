"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Eye, CalendarDays, Clock, MapPin, Plus, Download } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useEventStore } from "@/store/use-event-store"
import { ClearanceLevel, EventItem } from "@/constants/event-data"
import EventsFilter from "./event-filter"

export default function EventsManager() {
  const { filteredEvents, currentPage, setCurrentPage } = useEventStore()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [attendeePage, setAttendeePage] = useState(1)

  const allFiltered = filteredEvents()
  const itemsPerPage = 8

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return allFiltered.slice(start, start + itemsPerPage)
  }, [allFiltered, currentPage])

  const totalPages = Math.ceil(allFiltered.length / itemsPerPage)

  const exportToPDF = (event: EventItem) => {
    const doc = new jsPDF()
    doc.text(`Attendee List: ${event.name}`, 14, 15)
    autoTable(doc, {
      head: [["Name", "Email", "Amount"]],
      body: event.registeredMembers.map((m) => [
        m.name,
        m.email,
        `$${m.paymentAmount}`,
      ]),
      startY: 25,
    })
    doc.save(`${event.name.replace(/\s+/g, "_")}_attendees.pdf`)
  }

  const getBadgeStyles = (clearance: ClearanceLevel) => {
    switch (clearance) {
      case "Board":
        return "bg-purple-100 text-purple-700"
      case "Pastoral":
        return "bg-amber-100 text-amber-700"
      case "General":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="space-y-6 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Donation Payments
          </h1>
          <p className="mt-2 text-slate-500">
            Monitor dues capture, review status, and filter transaction records.
          </p>
        </div>

        {/* ADD NEW EVENT DIALOG */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Event Name</Label>
                <Input placeholder="Annual Leadership Conference" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="grid gap-2">
                  <Label>Time</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input placeholder="Grand Ballroom" />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none">
                  <option value="Conference">Conference</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Speaker</Label>
                <Input placeholder="Dr. Ahmed Rahman" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Capacity</Label>
                  <Input type="number" placeholder="100" />
                </div>
                <div className="grid gap-2">
                  <Label>Clearance</Label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none">
                    <option value="Board">Board</option>
                    <option value="Pastoral">Pastoral</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Input placeholder="A deep dive into strategic leadership..." />
              </div>
            </div>
            <Button onClick={() => setIsAddModalOpen(false)}>
              Create Event
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <EventsFilter />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {paginatedEvents.map((event) => (
          <Card
            key={event.id}
            className="flex flex-col overflow-hidden rounded-2xl"
          >
            <div className="relative h-40 w-full bg-slate-100">
              <Image
                src={`/${event.imageUrl}`}
                alt={event.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge
                  className={`${getBadgeStyles(event.minClearance)} border-0`}
                >
                  {event.minClearance}
                </Badge>
              </div>
            </div>
            <div className="flex flex-grow flex-col p-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                {event.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{event.name}</h3>
              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-3 w-3" /> {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" /> {event.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> {event.location}
                </div>
              </div>
              <div className="mt-4 mt-auto border-t pt-4">
                <Button
                  onClick={() => setSelectedEvent(event)}
                  className="h-9 w-full rounded-lg"
                  size="sm"
                >
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* VIEW DETAILS DIALOG */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-w-4xl! overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
          <div className="border-b border-slate-200 bg-slate-50/80 p-8">
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
                {selectedEvent?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { label: "Date", value: selectedEvent?.date },
                { label: "Time", value: selectedEvent?.time },
                { label: "Location", value: selectedEvent?.location },
                { label: "Category", value: selectedEvent?.category },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold">Attendee Registry</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedEvent && exportToPDF(selectedEvent)}
              >
                <Download className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </div>
            <div className="rounded-xl border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedEvent?.registeredMembers
                    .slice((attendeePage - 1) * 10, attendeePage * 10)
                    .map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.name}</TableCell>
                        <TableCell>{m.email}</TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          ${m.paymentAmount}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
