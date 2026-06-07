import React from "react"
import { IconMail, IconInfoCircle, IconEye } from "@tabler/icons-react"

export default function NewsArchivePage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Newsletter & News Archive
          </h2>
          <p className="text-muted-foreground">
            Browse through past editions of FCH Newsletters and official
            publications.
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
                Fetch newsletter campaign histories from Mailchimp,
                ActiveCampaign, or custom markdown database tables.
              </li>
              <li>
                Implement a newsletter subscription toggle that calls your
                backend newsletter signup/sync API.
              </li>
              <li>
                Setup an embeddable PDF viewer or parse newsletter HTML for
                users to read directly in the portal.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Newsletters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "FCH Connection - June 2026 Edition",
            date: "Published: June 01, 2026",
            issues: "Issue 45",
            summary:
              "Focusing on upcoming summer faith summits, new pastoral templates release, and updates from the FCH board.",
          },
          {
            title: "FCH Connection - May 2026 Edition",
            date: "Published: May 01, 2026",
            issues: "Issue 44",
            summary:
              "Discussion on parish outreach methods, webinar feedback, and upcoming Spring webinar schedules.",
          },
          {
            title: "FCH Connection - April 2026 Edition",
            date: "Published: April 01, 2026",
            issues: "Issue 43",
            summary:
              "Special Easter edition covering catechetical program reviews and diocese ministry planning schedules.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-xs"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <IconMail className="size-6" />
                </div>
                <div>
                  <h4 className="line-clamp-1 text-sm font-semibold">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {item.date} • {item.issues}
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                {item.summary}
              </p>
            </div>
            <div className="mt-5 border-t pt-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs font-semibold transition-colors hover:bg-secondary/80">
                <IconEye className="size-4" /> Read Issue
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
