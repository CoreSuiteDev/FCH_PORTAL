import React from "react"
import { IconInfoCircle, IconHelp } from "@tabler/icons-react"

export default function HelpPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
          <p className="text-muted-foreground">
            Access guides, tutorials, FAQs, or submit support requests.
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
              <li>Submit Support Tickets: Setup a POST endpoint `/api/support/tickets` to save user help queries to the database and send alert emails to the admin panel.</li>
              <li>Fetch FAQs Dynamically: Pull standard troubleshooting documents and guides from database tables.</li>
              <li>Add FAQ search: Allow users to search guides by keyword.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock FAQs Accordion */}
      <div className="rounded-lg border bg-card p-6 space-y-4 max-w-3xl">
        <h3 className="text-base font-bold tracking-tight border-b pb-2 flex items-center gap-2">
          <IconHelp className="size-5" /> Frequently Asked Questions
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-foreground">How do I access Pastoral Resources?</h4>
            <p className="text-muted-foreground mt-1">Pastoral resources are restricted to accounts with approved Pastoral membership level. Make sure your account is upgraded.</p>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold text-foreground">What happens if my payment fails?</h4>
            <p className="text-muted-foreground mt-1">We offer a 7-day grace period for failed subscription renewals. If unpaid after 7 days, your account status will downgrade to basic access automatically.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
