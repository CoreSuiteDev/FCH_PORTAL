import React from "react"
import { IconFileText, IconInfoCircle, IconLock } from "@tabler/icons-react"

export default function SpecialPastoralResourcesPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Special Pastoral Resources
          </h2>
          <p className="text-muted-foreground">
            Confidential liturgy planning templates, specific parish council
            materials, and diocesan tools.
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
                Role Access verification: This route must be protected. Only
                logged-in users with a valid `Pastoral` or `Board` membership
                status are allowed to view or download.
              </li>
              <li>
                Setup secure file stream: Serve files via a secure backend route
                that reads from disk/S3 and pipes output to prevent direct URL
                hotlinking.
              </li>
              <li>
                Audit logging: Log every file read or download with timestamp
                and user ID.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Special Resources List */}
      <div className="space-y-3">
        {[
          {
            name: "Liturgy Planning Grid & Coordination Sheets",
            size: "3.2 MB",
            updated: "Updated May 2026",
          },
          {
            name: "Confidential Pastoral Counseling Manual",
            size: "8.1 MB",
            updated: "Updated April 2026",
          },
        ].map((doc, index) => (
          <div
            key={index}
            className="relative flex items-center justify-between overflow-hidden rounded-lg border bg-card p-4 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-secondary p-2 text-primary">
                <IconFileText className="size-6 text-zinc-400" />
              </span>
              <div>
                <h4 className="cursor-pointer text-sm font-semibold hover:underline">
                  {doc.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  PDF Document • {doc.size} • {doc.updated}
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-md border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <IconLock className="size-4 text-amber-500" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
