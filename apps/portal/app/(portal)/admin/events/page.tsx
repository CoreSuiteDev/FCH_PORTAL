import React from "react"
import { IconInfoCircle, IconPlus, IconUsers } from "@tabler/icons-react"

export default function AdminEventsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Events Manager</h2>
          <p className="text-muted-foreground">
            Schedule new portal events, manage zoom links, and track member
            registrations.
          </p>
        </div>
        <div className="flex shrink-0">
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90">
            <IconPlus className="size-4" /> Schedule Event
          </button>
        </div>
      </div>

      {/* Developer Notes / TODO */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
        <div className="flex items-start gap-3">
          <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">
              Developer TODO Checklist:
            </h4>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                Event creation forms: Build forms to insert event details
                (Title, date/time, Zoom details, category, paid/free ticket
                details) into the events database.
              </li>
              <li>
                Registrant list audits: Implement a sub-page displaying a list
                of users registered for each event, with buttons to export
                attendee CSVs.
              </li>
              <li>
                Zoom Integration: Setup Zoom API or calendar hooks to
                automatically schedule Zoom conferences when creating virtual
                events.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Events List */}
      <div className="space-y-4">
        {[
          {
            title: "FCH Summer Faith Summit 2026",
            date: "July 12-14, 2026",
            registrants: "148 registered",
            status: "Active",
          },
          {
            title: "Virtual Roundtable: Modern Parish Challenges",
            date: "June 25, 2026",
            registrants: "64 registered",
            status: "Active",
          },
        ].map((event, index) => (
          <div
            key={index}
            className="flex flex-col justify-between gap-4 rounded-lg border bg-card p-6 shadow-xs md:flex-row md:items-center"
          >
            <div className="space-y-1">
              <span className="inline-flex items-center rounded bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-500">
                {event.status}
              </span>
              <h4 className="text-base font-bold tracking-tight">
                {event.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                Date: {event.date} • {event.registrants}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button className="flex items-center gap-1.5 rounded-md border bg-secondary px-3 py-2 text-xs font-semibold transition-colors hover:bg-secondary/80">
                <IconUsers className="size-4" /> Manage Registrants
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
