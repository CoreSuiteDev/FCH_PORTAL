import React from "react"
import { IconVideo, IconInfoCircle, IconLock, IconPlayerPlay } from "@tabler/icons-react"

export default function AdvancedWebinarsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Advanced Webinar & Training</h2>
          <p className="text-muted-foreground">
            Specialized training videos, guest theological seminars, and advanced pastoral leadership webinars.
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
              <li>Role Access verification: Enforce that only logged-in users with a valid `Pastoral` or `Board` membership status are permitted to access this page. Block or redirect general users.</li>
              <li>Setup advanced video embeds: Connect to your Vimeo Advanced folder or Mux streams.</li>
              <li>Implement discussion forums: Setup a comments/chat forum underneath the webinar streams to support member Q&A.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Webinars */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Advanced Theology Seminar: Sacramental Models",
            speaker: "Msgr. James Vance, D.D.",
            duration: "1 hr 45 mins",
            desc: "An advanced, deep-dive examination of sacramental models and theological foundations for modern dioceses.",
          },
          {
            title: "Pastoral Care in Complex Crisis Environments",
            speaker: "Dr. Rachel Green & Panel",
            duration: "2 hr 10 mins",
            desc: "Expert panel outlining crisis counseling methodologies, legal frameworks, and support networks for parish leadership.",
          },
        ].map((webinar, index) => (
          <div key={index} className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-xs relative">
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded bg-amber-500/95 text-white px-2 py-0.5 text-[10px] font-semibold">
              <IconLock className="size-3" /> Locked
            </div>
            {/* Video Thumbnail Placeholder */}
            <div className="relative flex aspect-video items-center justify-center bg-zinc-950 text-white">
              <IconVideo className="size-12 opacity-30" />
              <button className="absolute flex size-12 items-center justify-center rounded-full bg-primary/95 text-primary-foreground shadow-md hover:scale-105 transition-all">
                <IconPlayerPlay className="size-6 fill-current" />
              </button>
              <span className="absolute bottom-2 right-2 rounded-sm bg-black/80 px-2 py-0.5 text-[10px] font-semibold">
                {webinar.duration}
              </span>
            </div>
            {/* Details */}
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h4 className="font-semibold text-base tracking-tight hover:underline cursor-pointer">
                  {webinar.title}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">Presented by {webinar.speaker}</p>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                  {webinar.desc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t">
                <button className="text-xs font-semibold text-primary hover:underline">
                  Unlock Webinar & Study Guides →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
