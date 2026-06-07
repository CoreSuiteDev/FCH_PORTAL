import React from "react"
import { IconInfoCircle, IconLock, IconDownload } from "@tabler/icons-react"

export default function CatecheticalResourcesPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Catechetical Tools & Templates
          </h2>
          <p className="text-muted-foreground">
            Lesson planners, educational tools, slides, and catechesis study
            structures.
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
                {`                Access Control: Verify membership limits. General members should
                only get 'Limited' preview; show full templates and high-res
                downloads only for Pastoral/Board members.`}
              </li>
              <li>
                {` Provide search indexing: Let users search by grade level (K-5,
                Middle School, High School, Adult) and liturgical calendar
                season (Advent, Lent, Ordinary Time).`}
              </li>
              <li>
                {` Setup lesson planner builder: Implement an interactive builder
                where members can fill out fields and export a PDF.`}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Resources List */}
      <div className="space-y-4">
        {[
          {
            title: "Liturgical Calendar Lesson Plan Outline",
            level: "Full Access (Pastoral/Board)",
            isLocked: true,
            description:
              "A complete step-by-step teaching template mapping sacraments to seasons, including slide assets.",
            format: "PDF & PPTX",
          },
          {
            title: "First Communion Preparation Toolkit",
            level: "Full Access (Pastoral/Board)",
            isLocked: true,
            description:
              "Activity sheets, parent booklets, and teaching slides tailored for parish children preparation classes.",
            format: "DOCX & PDF",
          },
          {
            title: "Basic Scripture Study Worksheet (Intro)",
            level: "Basic Access (All Members)",
            isLocked: false,
            description:
              "A printable study sheet for classroom reading groups. Available to all members.",
            format: "PDF File",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-lg border bg-card p-6 shadow-xs md:flex-row md:items-center"
          >
            <div className="max-w-2xl space-y-1.5">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${item.isLocked ? "bg-amber-500/10 text-amber-500" : "bg-green-500/10 text-green-500"}`}
              >
                {item.level}
              </span>
              <h3 className="text-lg font-bold tracking-tight">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Formats available:{" "}
                <span className="font-semibold">{item.format}</span>
              </p>
            </div>
            <div className="flex shrink-0">
              <button className="flex items-center gap-2 rounded-md border bg-secondary px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-secondary/80">
                {item.isLocked ? (
                  <IconLock className="size-4 text-amber-500" />
                ) : (
                  <IconDownload className="size-4" />
                )}{" "}
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
