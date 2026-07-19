import React from "react"
import { IconInfoCircle } from "@tabler/icons-react"

export default function AnnouncementsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Member Announcements
          </h2>
          <p className="text-muted-foreground">
            Stay updated with the latest news, events, and notices from the FCH
            team.
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
                Fetch real-time announcements from WordPress/MemberPress REST
                API or DB.
              </li>
              <li>
                Implement category filters (e.g., General, Urgent, Events,
                Newsletters).
              </li>
              <li>
                Add read/unread flags for logged-in members (stored in user
                profile DB).
              </li>
              <li>
                Integrate search functionality to filter announcements by
                keyword.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Announcements List */}
      <div className="space-y-4">
        {[
          {
            title: "FCH Annual Member Summit 2026 Registration Open",
            date: "June 05, 2026",
            excerpt:
              "Registration is now open for our annual member summit. General members get a 10% discount on tickets. Secure your spot today!",
            category: "Events",
            badgeColor: "bg-blue-500/10 text-blue-500",
          },
          {
            title: "Quarterly Pastoral Resources Update",
            date: "June 01, 2026",
            excerpt:
              "New resources have been added to the basic resource library. Explore our updated parish toolkits and catechetical guidelines.",
            category: "Updates",
            badgeColor: "bg-green-500/10 text-green-500",
          },
          {
            title: "Scheduled Maintenance for Portal on June 15",
            date: "May 28, 2026",
            excerpt:
              "The portal will undergo scheduled maintenance on June 15, 2026, from 2:00 AM to 4:00 AM EST. Access may be temporarily offline.",
            category: "System",
            badgeColor: "bg-amber-500/10 text-amber-500",
          },
        ].map((announcement, index) => (
          <div
            key={index}
            className="rounded-lg border bg-card p-6 shadow-xs transition-all hover:border-muted-foreground/30"
          >
            <div className="flex items-center justify-between gap-4">
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${announcement.badgeColor}`}
              >
                {announcement.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {announcement.date}
              </span>
            </div>
            <h3 className="mt-3 cursor-pointer text-lg font-semibold tracking-tight hover:underline">
              {announcement.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {announcement.excerpt}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
