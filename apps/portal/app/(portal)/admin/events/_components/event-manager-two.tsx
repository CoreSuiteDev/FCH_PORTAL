"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Eye, CalendarDays, Clock, MapPin, Download } from "lucide-react"
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
} from "@workspace/ui/components/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import AddNewEvent from "./add-event"
import EventsFilter from "./event-filter"
import { getEvents } from "@/services/event-service"

export default function EventsManagerTwo() {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const data = await getEvents()
        setEvents(data || [])
      } catch (err) {
        console.error("ইভেন্ট লোড করতে সমস্যা হয়েছে", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const exportToPDF = (event: any) => {
    const doc = new jsPDF()
    doc.text(`Attendee List: ${event.title}`, 14, 15)
    // registeredMembers যদি না থাকে তবে খালি অ্যারে পাঠানো হয়েছে
    const members = event.registeredMembers || []
    autoTable(doc, {
      head: [["Name", "Email", "Amount"]],
      body: members.map((m: any) => [
        m.name,
        m.email,
        `$${m.paymentAmount || 0}`,
      ]),
      startY: 25,
    })
    doc.save(`${event.title.replace(/\s+/g, "_")}_attendees.pdf`)
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString()
  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

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
        <AddNewEvent />
      </div>

      <EventsFilter />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {events.map((event) => (
          <Card
            key={event.id}
            className="flex flex-col overflow-hidden rounded-2xl"
          >
            <div className="relative h-40 w-full bg-slate-100">
              {event.coverImage && (
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute top-3 right-3">
                <Badge className="border-0 bg-emerald-100 text-emerald-700">
                  {event.visibility}
                </Badge>
              </div>
            </div>
            <div className="flex flex-grow flex-col p-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                {event.eventType}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {event.title}
              </h3>
              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-3 w-3" />{" "}
                  {formatDate(event.startDate)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" /> {formatTime(event.startDate)}
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

      {/* VIEW DETAILS DIALOG (Design Kept Same) */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-w-4xl! overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
          <div className="border-b border-slate-200 bg-slate-50/80 p-8">
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
                {selectedEvent?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                {
                  label: "Date",
                  value: selectedEvent
                    ? formatDate(selectedEvent.startDate)
                    : "",
                },
                {
                  label: "Time",
                  value: selectedEvent
                    ? formatTime(selectedEvent.startDate)
                    : "",
                },
                { label: "Location", value: selectedEvent?.location },
                { label: "Capacity", value: selectedEvent?.maxCapacity },
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
                  {(selectedEvent?.registeredMembers || []).map((m: any) => (
                    <TableRow key={m.id || m.email}>
                      <TableCell>{m.name}</TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        ${m.paymentAmount || 0}
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
