import React from "react"
import { IconVideo, IconInfoCircle, IconPlus, IconEye } from "@tabler/icons-react"

export default function AdminWebinarsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Webinar Library</h2>
          <p className="text-muted-foreground">
            Publish new webinars, track registrations, and monitor viewer analytics logs.
          </p>
        </div>
        <div className="flex shrink-0">
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs">
            <IconPlus className="size-4" /> Add New Webinar
          </button>
        </div>
      </div>

      {/* Developer Notes / TODO */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
        <div className="flex items-start gap-3">
          <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">Developer TODO Checklist:</h4>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Webinar Forms: Build a complete metadata form (Title, Speaker, Description, Vimeo Video ID/URL, duration, date, and access tier like General/Pastoral).</li>
              <li>Viewer Analytics: Implement log tracking to count how many times each webinar has been viewed.</li>
              <li>Access restriction validations: Ensure webinars tagged for Pastoral members are hidden for General members.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Webinars list */}
      <div className="space-y-4">
        {[
          {
            title: "Welcome to FCH: General Member Induction",
            speaker: "Sarah Jenkins",
            tier: "General Tiers",
            views: "142 views",
            date: "June 05, 2026",
          },
          {
            title: "Advanced Theology Seminar: Sacramental Models",
            speaker: "Msgr. James Vance",
            tier: "Pastoral / Board",
            views: "34 views",
            date: "June 02, 2026",
          },
        ].map((webinar, index) => (
          <div key={index} className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border bg-card p-6 shadow-xs gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                {webinar.tier}
              </span>
              <h4 className="font-bold tracking-tight text-base">{webinar.title}</h4>
              <p className="text-sm text-muted-foreground">Speaker: {webinar.speaker} • {webinar.views}</p>
              <p className="text-xs text-muted-foreground mt-1">Uploaded: {webinar.date}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button className="flex items-center gap-1.5 rounded-md bg-secondary border px-3 py-2 text-xs font-semibold hover:bg-secondary/80 transition-colors">
                <IconEye className="size-4" /> View Analytics
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}