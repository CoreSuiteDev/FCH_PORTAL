import React from "react"
import { IconDashboard, IconInfoCircle, IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"

export default function BoardRoomPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Board Room</h2>
          <p className="text-muted-foreground">
            Welcome to the FCH Board Portal. Access corporate governance documents, financial audits, committee files, and voting tools.
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
              <li>Strict Access Control: Ensure only users in the `Board Member` Okta group can load this route. Reject others with a 403.</li>
              <li>Setup live widgets: Render date of next scheduled board meeting, active resolution voting indicators, and recent financial upload logs.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Grid of Board Options */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Board Meetings",
            href: "/board/meetings",
            description: "View upcoming agendas and download archived minutes.",
          },
          {
            title: "Governance & Bylaws",
            href: "/board/documents",
            description: "Review compliance documents, charters, and policies.",
          },
          {
            title: "Financial Reports",
            href: "/board/financials",
            description: "Access balance sheets, tax audits, and treasury details.",
          },
          {
            title: "Committees Workspace",
            href: "/board/committees",
            description: "Collaborate on Audit, Finance, and Membership committees.",
          },
          {
            title: "Internal Planning",
            href: "/board/planning",
            description: "Track annual targets, timelines, and goal progress.",
          },
          {
            title: "Collaboration & Voting",
            href: "/board/collaboration",
            description: "Cast votes on resolutions and enter secure workspaces.",
          },
        ].map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-xs hover:border-muted-foreground/30 hover:shadow-md transition-all group"
          >
            <div>
              <h4 className="font-bold tracking-tight text-base group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary">
              Open Section <IconArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
