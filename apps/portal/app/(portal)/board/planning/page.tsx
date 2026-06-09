import React from "react"
import {  IconInfoCircle, IconLock } from "@tabler/icons-react"

export default function BoardPlanningPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Internal Planning Workspace
          </h2>
          <p className="text-muted-foreground">
            Monitor strategic goals, annual timelines, diocese milestones, and
            implementation roadmaps.
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
                Role Access check: Lock down access entirely to Board users.
              </li>
              <li>
                Setup timeline tracker: Build an interactive Kanban board or
                Gantt chart tracker (using library components like Dnd-Kit or
                React-Gantt).
              </li>
              <li>
                Integrate planning templates database to track milestones.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Project Timeline */}
      <div className="space-y-4">
        {[
          {
            title: "FCH Portal Launch & Member Integration",
            quarter: "Q2-Q3 2026",
            progress: "75%",
            status: "Active",
            desc: "Setting up Okta user groups, linking MemberPress memberships, and rolling out initial resource databases.",
          },
          {
            title: "Annual Liturgical Syllabus Overhaul",
            quarter: "Q3-Q4 2026",
            progress: "20%",
            status: "Planning",
            desc: "Drafting catechetical templates, compiling parish outreach kits, and coordinating diocesan committee approvals.",
          },
        ].map((project, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg border bg-card p-6 shadow-xs"
          >
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500">
              <IconLock className="size-3.5" /> Locked
            </div>
            <div>
              <span className="text-xs font-semibold text-primary">
                {project.quarter} • {project.status}
              </span>
              <h3 className="mt-1 text-lg font-bold tracking-tight">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {project.desc}
              </p>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Development Progress</span>
                  <span className="font-semibold text-foreground">
                    {project.progress}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: project.progress }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
