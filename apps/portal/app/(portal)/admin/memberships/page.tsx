import React from "react"
import { IconSettings, IconInfoCircle, IconAlertTriangle } from "@tabler/icons-react"

export default function AdminMembershipsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Membership Status Manager</h2>
          <p className="text-muted-foreground">
            Review active, expired, canceled, and pending applications. Manually adjust membership statuses.
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
              <li>Status Toggle Actions: Build forms or toggle components to change member status (e.g., from 'Pending' to 'Active').</li>
              <li>Okta Synchronizer: Integrate status adjustments with Okta group management APIs. When a status is changed to 'Expired' or 'Canceled', automatically call Okta API to remove the user from the respective paid Okta group.</li>
              <li>Billing Webhook fallback: Integrate database logs so that webhooks from Stripe automatically trigger these adjustments.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Pending Approvals List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Pending Membership Requests</h3>
        {[
          {
            name: "Emily Watson",
            email: "e.watson@catholicacademy.edu",
            requestedLevel: "Pastoral Member",
            date: "Submitted: June 04, 2026",
          },
          {
            name: "Fr. Mark Alvis",
            email: "m.alvis@stpeterparish.org",
            requestedLevel: "Pastoral Member",
            date: "Submitted: June 03, 2026",
          },
        ].map((pending, index) => (
          <div key={index} className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border bg-card p-6 shadow-xs gap-4">
            <div>
              <h4 className="font-bold tracking-tight text-base">{pending.name}</h4>
              <p className="text-sm text-muted-foreground">{pending.email} • {pending.requestedLevel}</p>
              <p className="text-xs text-muted-foreground mt-1">{pending.date}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button className="rounded-md bg-secondary border px-3 py-1.5 text-xs font-semibold hover:bg-secondary/80 transition-colors">
                Reject Application
              </button>
              <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Approve & Activate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}