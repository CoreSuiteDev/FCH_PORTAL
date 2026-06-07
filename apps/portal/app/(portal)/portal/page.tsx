import { IconArrowRight, IconInfoCircle } from "@tabler/icons-react"
import Link from "next/link"

export default function PortalDashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Member Dashboard
          </h2>
          <p className="text-muted-foreground">
            Welcome to the FCH Member Portal. Access announcements, event
            signups, learning webinars, and basic resources.
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
                {` Retrieve logged-in user context and display customized greetings
                (e.g. "Welcome back, John!").`}
              </li>
              <li>
                Render dynamic member badge status (Active, Expired, Canceled)
                by verifying Stripe/MemberPress webhooks inside DB.
              </li>
              <li>
                Setup widgets to show recent unread announcements, next event
                registration, and basic statistics.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dashboard Shortcuts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Member Announcements",
            href: "/portal/announcements",
            description: "View latest news updates and system notifications.",
          },
          {
            title: "Events Registration",
            href: "/portal/events",
            description: "Browse upcoming workshops and register for summits.",
          },
          {
            title: "Webinar Recordings",
            href: "/portal/webinars",
            description: "Watch past member training and guest recordings.",
          },
          {
            title: "Basic Resource Library",
            href: "/portal/resources/basic",
            description:
              "Download outreach templates, handbooks, and reference files.",
          },
          {
            title: "FCH General Documents",
            href: "/portal/documents",
            description:
              "Access bylaws, organizational policies, and safety guides.",
          },
          {
            title: "News/Newsletter Archive",
            href: "/portal/news",
            description: "Browse monthly FCH Connection newsletters archive.",
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
              Access Page{" "}
              <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
