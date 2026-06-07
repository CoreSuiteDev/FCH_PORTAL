import React from "react"
import {
  IconFileText,
  IconInfoCircle,
  IconDownload,
  IconShieldLock,
} from "@tabler/icons-react"

export default function BoardDocumentsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Corporate Governance & Bylaws
          </h2>
          <p className="text-muted-foreground">
            Bylaws, charters, conflict policies, and governance guidelines
            reserved strictly for the Board.
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
              <li>Access control: Block users without Board permissions.</li>
              <li>
                Setup secure pdf viewer: Add inline secure PDF display to
                prevent unauthorized downloading or hotlinking.
              </li>
              <li>
                Version control tracking: List historical revisions of bylaws
                and charter amendments.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Documents */}
      <div className="space-y-3">
        {[
          {
            name: "FCH Amended Constitution & Bylaws (Board Version)",
            size: "3.4 MB",
            version: "v4.2",
            date: "Effective Jan 2026",
          },
          {
            name: "Board Code of Ethics & Conflict of Interest Policy",
            size: "1.1 MB",
            version: "v2.1",
            date: "Effective March 2025",
          },
          {
            name: "FCH Executive Committee Charter",
            size: "920 KB",
            version: "v1.0",
            date: "Effective Oct 2024",
          },
        ].map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-xs transition-colors hover:border-muted-foreground/30"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-secondary p-2 text-primary">
                <IconShieldLock className="size-6 text-zinc-400" />
              </span>
              <div>
                <h4 className="cursor-pointer text-sm font-semibold hover:underline">
                  {doc.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  PDF Document • {doc.size} • Revision: {doc.version} (
                  {doc.date})
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors hover:bg-secondary">
              <IconDownload className="size-3.5" /> Secure Download
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
