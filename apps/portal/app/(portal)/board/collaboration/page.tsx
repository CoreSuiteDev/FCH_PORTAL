import React from "react"
import {
  IconUsers,
  IconInfoCircle,
  IconLock,
  IconChevronRight,
} from "@tabler/icons-react"

export default function BoardCollaborationPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Board Collaboration & Voting
          </h2>
          <p className="text-muted-foreground">
            Cast votes on resolutions, access secure chat links, and participate
            in active board decisions.
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
                Access control: Lock access to Board members inside Okta groups.
              </li>
              <li>
                Setup secure resolution voting: Implement voting API. Record
                choices securely in the database (ensuring each member can only
                vote once per resolution).
              </li>
              <li>
                Integrate Slack/Teams: Embed private Slack webhook triggers or
                secure channel invitation links.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Voting Resolutions */}
      <div className="space-y-4">
        {[
          {
            id: "RES-2026-04",
            title: "Approval of Q3 Annual Diocesan Budget Allocation",
            deadline: "June 20, 2026",
            status: "Open for Voting",
            badgeColor: "bg-green-500/10 text-green-500",
          },
          {
            id: "RES-2026-03",
            title: "Appointment of Membership Committee Chairperson",
            deadline: "June 15, 2026",
            status: "Open for Voting",
            badgeColor: "bg-green-500/10 text-green-500",
          },
        ].map((res, index) => (
          <div
            key={index}
            className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-lg border bg-card p-6 shadow-xs md:flex-row md:items-center"
          >
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
              <IconLock className="size-3" /> Secure
            </div>
            <div className="space-y-1.5">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${res.badgeColor}`}
              >
                {res.status}
              </span>
              <h3 className="text-base font-bold tracking-tight">
                {res.id}: {res.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                Voting Deadline:{" "}
                <span className="font-semibold">{res.deadline}</span>
              </p>
            </div>
            <div className="flex shrink-0">
              <button className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Cast Your Vote <IconChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
