import React from "react"
import { IconInfoCircle, IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"

export default function AdminOverviewPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Console</h2>
          <p className="text-muted-foreground">
            Manage FCH portal users, memberships, payments, event signups,
            webinars, and resource files.
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
                Role Authorization: Strictly lock this route behind Okta admin
                groups (e.g. `FCH Admin`). Redirect non-admins to `/forbidden`.
              </li>
              <li>
                Setup live charts and counter cards: Fetch stats from DB (active
                users count, payments collected, pending renewals, webinar
                uploads).
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Grid of Admin Tools */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Manage Users",
            href: "/admin/members",
            description:
              "View, filter, and export user profiles by membership level.",
          },
          {
            title: "Membership Statuses",
            href: "/admin/memberships",
            description:
              "Manually adjust statuses (Active, Expired, Canceled, Pending).",
          },
          {
            title: "Board Access",
            href: "/admin/board-management",
            description: "Assign or revoke secure board member clearance.",
          },
          {
            title: "Payments & Stripe",
            href: "/admin/payments",
            description: "Monitor transactions, payouts, and payment failures.",
          },
          {
            title: "Track Renewals",
            href: "/admin/renewals",
            description: "Track memberships set to expire and send reminders.",
          },
          {
            title: "Send Communications",
            href: "/admin/communications",
            description:
              "Draft emails and broadcast announcements to member tiers.",
          },
          {
            title: "Events Manager",
            href: "/admin/events",
            description: "Create events and track attendees registries.",
          },
          {
            title: "Webinar Manager",
            href: "/admin/webinars",
            description:
              "Upload recordings and manage member webinar libraries.",
          },
          {
            title: "Upload Resources",
            href: "/admin/resources",
            description:
              "Upload files and assign access tiers (General/Pastoral/Board).",
          },
          {
            title: "Protected Settings",
            href: "/admin/settings",
            description:
              "Configure portal keys, billing grace periods, and access parameters.",
          },
        ].map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="group flex flex-col justify-between rounded-lg border bg-card p-6 shadow-xs transition-all hover:border-muted-foreground/30 hover:shadow-md"
          >
            <div>
              <h4 className="text-base font-bold tracking-tight transition-colors group-hover:text-primary">
                {item.title}
              </h4>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary">
              Manage Section{" "}
              <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
