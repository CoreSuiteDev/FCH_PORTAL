import React from "react"
import { IconCalendarEvent, IconInfoCircle, IconLink } from "@tabler/icons-react"

export default function EventsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Member Events</h2>
          <p className="text-muted-foreground">
            Register for upcoming faith summits, virtual roundtables, workshops, and webinars.
          </p>
        </div>
      </div>

      {/* Developer Notes / TODO */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
        <div className="flex items-start gap-3">
          <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">Developer TODO Checklist:</h4>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Fetch events from the calendar database or external APIs (e.g. Google Calendar, Zoom Events).</li>
              <li>Setup registration: Connect the "Register" button to a checkout form (Stripe for paid, custom register API for free).</li>
              <li>Save registrations: Store registrants' Okta sub/userID in database to show registration status (e.g. 'You are registered!').</li>
              <li>Implement filtering: Sort by "All Events", "My Registered Events", "Past Events".</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Events */}
      <div className="space-y-4">
        {[
          {
            title: "FCH Summer Faith Summit 2026",
            date: "July 12-14, 2026",
            time: "09:00 AM - 05:00 PM EST",
            location: "Orlando Convention Center (Hybrid)",
            description: "Join hundreds of faith leaders, ministry practitioners, and catechists for three days of fellowship, presentations, and workshops.",
            status: "Open",
            btnText: "Register for Summit",
          },
          {
            title: "Virtual Roundtable: Modern Parish Challenges",
            date: "June 25, 2026",
            time: "03:00 PM - 04:30 PM EST",
            location: "Online (Zoom)",
            description: "An open roundtable for general and pastoral members focusing on parish community engagement post-pandemic.",
            status: "Open",
            btnText: "Reserve Zoom Link",
          },
          {
            title: "Catechist Training Workshop (Level 1)",
            date: "June 18, 2026",
            time: "01:00 PM - 03:00 PM EST",
            location: "Online (Vimeo Interactive)",
            description: "Specialized training workshop covering standard Level 1 catechetical teaching templates and toolkits.",
            status: "Limited Space",
            btnText: "Apply for Entry",
          },
        ].map((event, index) => (
          <div key={index} className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border bg-card p-6 shadow-xs gap-6 hover:border-muted-foreground/30 transition-colors">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary/10 p-1.5 text-primary">
                  <IconCalendarEvent className="size-5" />
                </span>
                <span className="text-xs font-semibold text-primary">{event.date} • {event.time}</span>
              </div>
              <h3 className="text-lg font-bold tracking-tight">{event.title}</h3>
              <p className="text-xs text-muted-foreground">Location: <span className="font-semibold text-foreground">{event.location}</span></p>
              <p className="text-sm text-muted-foreground mt-1">
                {event.description}
              </p>
            </div>
            <div className="flex flex-col items-stretch md:items-end justify-center shrink-0 gap-2 min-w-[150px]">
              <span className={`inline-flex self-start md:self-end items-center rounded-md px-2 py-1 text-xs font-medium ${event.status === "Open" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"}`}>
                {event.status}
              </span>
              <button className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                <IconLink className="size-4" /> {event.btnText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}