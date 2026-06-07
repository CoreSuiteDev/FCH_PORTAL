import React from "react"
import { IconInfoCircle, IconLock, IconChevronRight } from "@tabler/icons-react"

export default function ParishDioceseMinistryPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Parish & Diocese Ministry Resources
          </h2>
          <p className="text-muted-foreground">
            Diocesan guidelines, pastoral policies, ministry models, and parish
            governance materials.
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
                Role Access restrictions: Secure this route entirely. Only
                logged-in users with a valid `Pastoral` or `Board` membership
                status inside Okta groups should be permitted to view this
                content.
              </li>
              <li>
                Setup dynamic categories: Organize by Parish Ministry, Diocesan
                Policies, and Liturgical Guidelines.
              </li>
              <li>
                Implement audit logging: Keep tracks of files viewed or
                downloaded since diocesan documents contain policy declarations.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Ministry Resources */}
      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            title: "Diocesan Reporting & Auditing Protocols",
            level: "Full Access (Pastoral/Board)",
            category: "Diocese Policy",
            desc: "Annual compliance structures, financial auditing standards, and disclosure models required by diocesan councils.",
          },
          {
            title: "Safe Environment Ministry Guidelines",
            level: "Full Access (Pastoral/Board)",
            category: "General Ministry",
            desc: "Onboarding standards, parish volunteer screening documents, and reporting protocols for safe environments.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col justify-between overflow-hidden rounded-lg border bg-card p-6 shadow-xs"
          >
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500">
              <IconLock className="size-3.5" /> Locked
            </div>
            <div>
              <span className="text-xs font-semibold text-primary">
                {item.category}
              </span>
              <h3 className="mt-2 cursor-pointer text-lg font-bold tracking-tight hover:underline">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </div>
            <div className="mt-6 border-t pt-3">
              <button className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Access Ministry Guidelines{" "}
                <IconChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
