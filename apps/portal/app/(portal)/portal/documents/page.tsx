import React from "react"
import {
  IconFileFilled,
  IconInfoCircle,
  IconDownload,
} from "@tabler/icons-react"

export default function GeneralDocumentsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            General FCH Documents
          </h2>
          <p className="text-muted-foreground">
            Official FCH organizational files, member templates, policies, and
            guidelines.
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
                Hook this directory list up to your media database or WordPress
                uploads table.
              </li>
              <li>
                Implement granular access checks using Okta groups: e.g. General
                FCH documents are visible to all, but Board documents are
                hidden.
              </li>
              <li>
                Provide search filters by date, document type, and target
                audience.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Documents */}
      <div className="space-y-3">
        {[
          {
            name: "FCH Constitution & Bylaws (General Version)",
            format: "PDF Document",
            size: "1.8 MB",
            updated: "Updated May 2026",
          },
          {
            name: "FCH Member Conflict of Interest Policy",
            format: "PDF Document",
            size: "540 KB",
            updated: "Updated Jan 2026",
          },
          {
            name: "General FCH Organizational Charter",
            format: "PDF Document",
            size: "1.1 MB",
            updated: "Updated March 2026",
          },
          {
            name: "FCH Portal Privacy and Safety Statement",
            format: "PDF Document",
            size: "320 KB",
            updated: "Updated May 2026",
          },
        ].map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-xs transition-colors hover:border-muted-foreground/30"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-secondary p-2 text-primary">
                <IconFileFilled className="size-6 text-zinc-400" />
              </span>
              <div>
                <h4 className="cursor-pointer text-sm font-semibold hover:underline">
                  {doc.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {doc.format} • {doc.size} • {doc.updated}
                </p>
              </div>
            </div>
            <button className="rounded-md border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <IconDownload className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
