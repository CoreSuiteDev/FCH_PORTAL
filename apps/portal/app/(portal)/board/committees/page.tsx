import React from "react"
import { IconInfoCircle, IconLock, IconFolder } from "@tabler/icons-react"

export default function BoardCommitteesPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Committees Workspace
          </h2>
          <p className="text-muted-foreground">
            Access files, projects, and discussions for active Board
            sub-committees.
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
                Role Access restriction: Strictly limit directories based on
                committee membership (e.g. Audit Committee folders are only
                visible to Audit members).
              </li>
              <li>
                Setup upload endpoint: Allow committee chairs to upload meeting
                summaries, briefings, and audit requests.
              </li>
              <li>
                Track downloads: Implement detailed download tracking metrics.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Committees Folders */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            name: "Audit & Finance Committee",
            filesCount: "12 files",
            updated: "Updated 2 days ago",
          },
          {
            name: "Governance & Policies Committee",
            filesCount: "8 files",
            updated: "Updated 1 week ago",
          },
          {
            name: "Membership & Portal Outreach",
            filesCount: "15 files",
            updated: "Updated 3 days ago",
          },
        ].map((committee, index) => (
          <div
            key={index}
            className="group flex cursor-pointer flex-col justify-between rounded-lg border bg-card p-6 shadow-xs transition-all hover:border-muted-foreground/30"
          >
            <div className="flex items-start justify-between">
              <span className="rounded-md bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <IconFolder className="size-6" />
              </span>
              <IconLock className="size-4 text-amber-500" />
            </div>
            <div className="mt-4">
              <h4 className="text-base font-bold tracking-tight">
                {committee.name}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {committee.filesCount} • {committee.updated}
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t pt-3 text-xs font-semibold text-primary">
              <span>Open Committee Folder</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
