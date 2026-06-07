import React from "react"
import { IconVideo, IconInfoCircle, IconPlayerPlay } from "@tabler/icons-react"


export default function WebinarsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Webinar Recordings</h2>
          <p className="text-muted-foreground">
            Watch past member-only webinar training videos, tutorials, and guest lectures.
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
              <li>Integrate video hosting (Vimeo SDK, AWS CloudFront, or Mux player) to embed secure streams.</li>
              <li>Setup access validation: Ensure only users with valid memberships can access the dynamic webinar route `[slug]/page.tsx`.</li>
              <li>Implement a 'Bookmark' or 'Watch Later' feature for logged-in user accounts.</li>
              <li>Fetch webinars metadata (title, speaker, length, description) from database.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Webinars */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Welcome to FCH: General Member Induction",
            speaker: "Sarah Jenkins, Membership Director",
            duration: "45 mins",
            thumbnail: "/mock/webinar1.jpg",
            desc: "Get an overview of your member benefits, FCH community expectations, and how to navigate core learning libraries.",
          },
          {
            title: "Effective Community Planning Strategies",
            speaker: "Fr. Robert Davis & Board Committee",
            duration: "1 hr 12 mins",
            thumbnail: "/mock/webinar2.jpg",
            desc: "Learn strategic parish organization models, outreach techniques, and guidelines for organizing public faith events.",
          },
          {
            title: "Introduction to Catechetical Teaching Methods",
            speaker: "Dr. Angela Martinez, Catechesis Chair",
            duration: "58 mins",
            thumbnail: "/mock/webinar3.jpg",
            desc: "A baseline breakdown of teaching templates and educational resources available for all levels of church educators.",
          },
        ].map((webinar, index) => (
          <div key={index} className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-xs hover:shadow-md transition-all">
            {/* Video Thumbnail Placeholder */}
            <div className="relative flex aspect-video items-center justify-center bg-zinc-950 text-white">
              <IconVideo className="size-12 opacity-30" />
              <button className="absolute flex size-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-md hover:scale-105 hover:bg-primary transition-all">
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
                  View Webinar Details & Notes →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}