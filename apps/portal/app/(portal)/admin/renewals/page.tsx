import React from "react"
import { IconAlertTriangle, IconInfoCircle, IconMailForward } from "@tabler/icons-react"

export default function AdminRenewalsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Track Renewals & Expirations</h2>
          <p className="text-muted-foreground">
            Monitor members with upcoming subscription expirations. Send renewal reminders.
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
              <li>Renewal queries: Query database for users whose memberships will expire within the next 30 days.</li>
              <li>Transactional Emails: Connect the "Send Reminder" button to your transactional email service (SendGrid, SES, Mailchimp) to send pre-formatted renewal prompts.</li>
              <li>Automate cron: Propose setting up a nightly CRON task that checks expirations and triggers reminders automatically.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Renewals List */}
      <div className="space-y-4">
        {[
          {
            name: "Msgr. James Vance",
            email: "j.vance@diocese.org",
            level: "Pastoral Member",
            expires: "Expires in 12 days (June 19, 2026)",
            status: "Urgent",
          },
          {
            name: "John Doe",
            email: "john.doe@gmail.com",
            level: "General Member",
            expires: "Expires in 28 days (July 05, 2026)",
            status: "Upcoming",
          },
        ].map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border bg-card p-6 shadow-xs gap-4">
            <div className="space-y-1">
              <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${item.status === "Urgent" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}>
                {item.status}
              </span>
              <h4 className="font-bold tracking-tight text-base">{item.name}</h4>
              <p className="text-sm text-muted-foreground">{item.email} • {item.level}</p>
              <p className="text-xs font-semibold text-red-500 mt-1">{item.expires}</p>
            </div>
            <div className="flex shrink-0">
              <button className="flex items-center gap-2 rounded-md bg-secondary border px-3 py-2 text-xs font-semibold hover:bg-secondary/80 transition-colors">
                <IconMailForward className="size-4" /> Send Renewal Email
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}