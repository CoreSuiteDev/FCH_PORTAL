import React from "react"
import { IconPresentation, IconInfoCircle, IconDownload, IconFileText } from "@tabler/icons-react"

export default function BoardMeetingsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Board Meetings & Minutes</h2>
          <p className="text-muted-foreground">
            Access upcoming agendas, download past meeting minutes, and check calendar schedules.
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
              <li>Secure Access: Ensure only Board users can load.</li>
              <li>Fetch meeting objects: Pull schedules (dates, zoom links, locations) and documents (agendas, minutes PDFs) from DB.</li>
              <li>Implement archiving: Create a collapsible accordion sorted by Year/Month for past meetings history.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Meetings */}
      <div className="space-y-4">
        {[
          {
            title: "Q3 Board Strategy & Audit Session",
            date: "Scheduled: September 10, 2026",
            status: "Upcoming",
            badgeColor: "bg-blue-500/10 text-blue-500",
            files: ["Q3 Agenda (Draft).pdf"],
          },
          {
            title: "Q2 Annual Planning Session",
            date: "Held: June 02, 2026",
            status: "Minutes Published",
            badgeColor: "bg-green-500/10 text-green-500",
            files: ["Q2 Meeting Minutes.pdf", "Q2 Agenda.pdf"],
          },
          {
            title: "Q1 Financial Review Meeting",
            date: "Held: March 05, 2026",
            status: "Minutes Published",
            badgeColor: "bg-green-500/10 text-green-500",
            files: ["Q1 Meeting Minutes.pdf", "Q1 Treasury Report.pdf"],
          },
        ].map((meeting, index) => (
          <div key={index} className="rounded-lg border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between gap-4">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${meeting.badgeColor}`}>
                {meeting.status}
              </span>
              <span className="text-sm text-muted-foreground">{meeting.date}</span>
            </div>
            <h3 className="mt-3 text-lg font-bold tracking-tight">{meeting.title}</h3>
            
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Meeting Attachments:</p>
              {meeting.files.map((file, fIndex) => (
                <div key={fIndex} className="flex items-center justify-between rounded-md bg-secondary/50 p-2.5 text-xs border">
                  <div className="flex items-center gap-2">
                    <IconFileText className="size-4 text-muted-foreground" />
                    <span>{file}</span>
                  </div>
                  <button className="flex items-center gap-1 text-primary hover:underline">
                    <IconDownload className="size-3.5" /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
