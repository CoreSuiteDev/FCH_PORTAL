import React from "react"
import { IconAward, IconInfoCircle, IconLock, IconChevronRight } from "@tabler/icons-react"

export default function PastoralLeadershipPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pastoral Leadership Materials</h2>
          <p className="text-muted-foreground">
            Development guides, pastoral articles, governance training manuals, and audio files.
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
              <li>Lock access to general members: Block view and redirect users without valid pastoral/board status to `/forbidden` page.</li>
              <li>Setup media library: Integrate audio (mp3 podcast feeds) and video training recordings for pastoral growth.</li>
              <li>Build 'Saved Materials' list: Allow members to bookmark specific leadership articles or guides.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Materials List */}
      <div className="grid gap-6 sm:grid-cols-2">
        {[
          {
            title: "Leading Parish Councils Effectively",
            author: "Fr. Thomas Clark",
            type: "E-Book Guide",
            desc: "Understand structures, conflict resolution methods, and planning outlines for annual parish council boards.",
          },
          {
            title: "Liturgical Preaching & Homily Guidelines",
            author: "Diocese Homiletics Committee",
            type: "PDF Document & Audio Feed",
            desc: "Structural techniques for aligning sermon prep with seasonal scripture guidelines and active community feedback.",
          },
        ].map((item, index) => (
          <div key={index} className="rounded-lg border bg-card p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">{item.type}</span>
                <IconLock className="size-4 text-amber-500" />
              </div>
              <h3 className="mt-3 text-lg font-bold tracking-tight hover:underline cursor-pointer">{item.title}</h3>
              <p className="text-xs text-muted-foreground">By {item.author}</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
            <div className="mt-5 pt-3 border-t">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                Read Material <IconChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}