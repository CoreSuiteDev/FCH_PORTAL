"use client"
import React, { useState } from "react"
import { useEventStore } from "@/store/use-event-store"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { EventForm } from "@/components/event-form"
import { EventItem } from "@/constants/manage-event"

export default function EventsManager() {
  const { events, addEvent, updateEvent } = useEventStore()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [viewMode, setViewMode] = useState<"manage" | "attendance" | null>(null)

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between">
        <h2 className="text-3xl font-bold">Event Registry</h2>
        <Button onClick={() => setIsAddOpen(true)}>+ Add New Event</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="p-4">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="mb-4 h-40 w-full rounded-lg object-cover"
            />
            <h3 className="text-xl font-bold">{event.name}</h3>
            <p className="text-sm text-slate-500">
              {event.date} at {event.time}
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedEvent(event)
                  setViewMode("attendance")
                }}
              >
                Attendance
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setSelectedEvent(event)
                  setViewMode("manage")
                }}
              >
                Manage
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Attendance Modal */}
      <Dialog
        open={viewMode === "attendance"}
        onOpenChange={() => setViewMode(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Attendees for {selectedEvent?.name}</DialogTitle>
          </DialogHeader>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Name</th>
                <th>Email</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {selectedEvent?.registeredMembers.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="py-2">{a.name}</td>
                  <td>{a.email}</td>
                  <td>${a.paymentAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
      </Dialog>

      {/* Manage/Edit Modal */}
      <Dialog
        open={viewMode === "manage"}
        onOpenChange={() => setViewMode(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Event</DialogTitle>
          </DialogHeader>
          <EventForm
            initialData={selectedEvent}
            onSubmit={(data) => {
              updateEvent({ ...selectedEvent!, ...data })
              setViewMode(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add New Modal */}
      {/* <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <EventForm
            onSubmit={(data) => {
              addEvent({
                ...data,
                id: Date.now().toString(),
                registeredMembers: [],
              })
              setIsAddOpen(false)
            }}
          />
        </DialogContent>
      </Dialog> */}
    </div>
  )
}
