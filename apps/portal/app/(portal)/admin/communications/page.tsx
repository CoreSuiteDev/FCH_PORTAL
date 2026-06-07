import React from "react"
import { IconMail, IconInfoCircle, IconSend } from "@tabler/icons-react"

export default function AdminCommunicationsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Communications Panel
          </h2>
          <p className="text-muted-foreground">
            Draft and send communications, newsletters, and announcements to
            members.
          </p>
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
                Email broadcast API: Setup a POST endpoint
                `/api/admin/communications/send` to process email broadcasts.
              </li>
              <li>
                Integrate mailing provider: Connect form fields to SendGrid,
                Mailchimp, or AWS SES API.
              </li>
              <li>
                User querying segmentation: Based on recipient select dropdown
                (All Members, Pastoral, Board), query the specific email arrays
                from the database.
              </li>
              <li>
                Log messages history: Save dispatched campaigns in the
                `communication_logs` table.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dispatch Mail Form Mock */}
      <div className="max-w-2xl space-y-4 rounded-lg border bg-card p-6">
        <h3 className="flex items-center gap-2 border-b pb-2 text-base font-bold tracking-tight">
          <IconMail className="size-5" /> Draft New Email Campaign
        </h3>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              Recipient Tier Segment
            </label>
            <select className="w-full rounded border bg-secondary/50 p-2 text-sm focus:outline-none">
              <option>All Members (General + Pastoral + Board)</option>
              <option>Pastoral Members Only</option>
              <option>Board Members Only</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              Subject Line
            </label>
            <input
              type="text"
              placeholder="e.g. FCH Resource Updates - June 2026"
              className="w-full rounded border bg-secondary/50 p-2 text-sm focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              Email Body
            </label>
            <textarea
              placeholder="Write email text here..."
              rows={6}
              className="w-full resize-none rounded border bg-secondary/50 p-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          <IconSend className="size-4" /> Dispatch Email Broadcast
        </button>
      </div>
    </div>
  )
}
