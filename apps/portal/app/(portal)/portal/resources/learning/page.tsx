import React from "react"
import { IconBooks, IconInfoCircle, IconLock } from "@tabler/icons-react"

export default function LearningLibraryPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Learning Library</h2>
          <p className="text-muted-foreground">
            Complete training guides, lecture notes, theological frameworks, and study modules.
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
              <li>LMS Integration: Fetch full courses, study lessons, and modules from LearnDash or DB tables.</li>
              <li>Membership Access Logic: Verify the logged-in user's role. General members should only see 'Limited' items; full list should be unlocked for Pastoral/Board members.</li>
              <li>Progression Tracking: Store completed status, quiz marks, and progress bar percentage in the user_learning_history database.</li>
              <li>Provide search filters by Topic (Theology, Sacraments, Liturgy) and Level (Introductory, Advanced).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Learning Modules */}
      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            title: "Theological Foundations 101",
            level: "Introductory",
            lessons: "8 lessons",
            isLocked: false,
            description: "A comprehensive introduction to fundamental theological doctrines and historical traditions. Free for all members.",
          },
          {
            title: "Advanced Pastoral Counseling & Care",
            level: "Advanced (Pastoral Only)",
            lessons: "14 lessons",
            isLocked: true,
            description: "Guidelines and case studies in counseling parish members through difficult life stages and spiritual crises.",
          },
          {
            title: "Diocese Financial Planning & Audits",
            level: "Advanced (Board Only)",
            lessons: "6 lessons",
            isLocked: true,
            description: "Best practices for diocese financial planning, fiscal accountability reports, and audit preparations.",
          },
          {
            title: "Modern Liturgy Planning & Structure",
            level: "Intermediate (Pastoral/Board)",
            lessons: "10 lessons",
            isLocked: true,
            description: "Step-by-step methods for planning liturgy structures, organizing choirs, and coordinating liturgical seasons.",
          },
        ].map((module, index) => (
          <div key={index} className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-xs relative overflow-hidden">
            {module.isLocked && (
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500">
                <IconLock className="size-3.5" /> Locked
              </div>
            )}
            <div>
              <span className="text-xs font-semibold text-primary">{module.level} • {module.lessons}</span>
              <h3 className="mt-2 text-lg font-bold tracking-tight hover:underline cursor-pointer">
                {module.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {module.description}
              </p>
            </div>
            <div className="mt-6 pt-3 border-t">
              <button className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Start Learning Module
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}