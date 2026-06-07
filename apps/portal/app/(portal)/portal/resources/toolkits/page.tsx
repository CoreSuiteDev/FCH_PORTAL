import React from "react"
import { IconInfoCircle, IconLock, IconDownload } from "@tabler/icons-react"

export default function MinistryToolkitsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Ministry Toolkits & Guides
          </h2>
          <p className="text-muted-foreground">
            Outreach templates, parish checklists, coordination planners, and
            ministry toolkits.
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
                {`Access verification: Check user role. General members should
                only see 'Limited' options; full toolkits and guides should be
                unlocked only for Pastoral/Board members.`}
              </li>
              <li>
                {`Setup file packaging: Create a backend route to bundle multiple
                toolkit files (PDF + DOCX + Excel planning charts) into a single
                ZIP for easy download.`}
              </li>
              <li>
                {`Provide search tagging: Tag items by event scale (Small Parish,
                Multi-Community, Diocese-Wide).`}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Toolkits Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Parish Family Festival Toolkit",
            type: "Complete Zip Bundle",
            level: "Full Access (Pastoral/Board)",
            isLocked: true,
            desc: "Planning guides, budget sheets, marketing flyers, and coordinator rosters for summer family events.",
          },
          {
            title: "Volunteer Coordination Guide",
            type: "Excel & PDF Templates",
            level: "Full Access (Pastoral/Board)",
            isLocked: true,
            desc: "Spreadsheets for tracking volunteer hours, role descriptions, and onboarding guidelines.",
          },
          {
            title: "Basic Community Outreach Toolkit",
            type: "PDF Document",
            level: "Basic Access (All Members)",
            isLocked: false,
            desc: "baseline templates for running local food drives and charity distributions.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col justify-between overflow-hidden rounded-lg border bg-card p-6 shadow-xs"
          >
            {item.isLocked && (
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                <IconLock className="size-3" /> Locked
              </div>
            )}
            <div>
              <span className="text-xs font-semibold text-primary">
                {item.type}
              </span>
              <h4 className="mt-2 text-base font-bold tracking-tight">
                {item.title}
              </h4>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {item.desc}
              </p>
            </div>
            <div className="mt-5 border-t pt-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-md border bg-secondary px-3 py-2 text-xs font-semibold transition-colors hover:bg-secondary/80">
                <IconDownload className="size-4" /> Download Toolkit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
