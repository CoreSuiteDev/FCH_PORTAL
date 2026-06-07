import React from "react"
import { IconInfoCircle, IconSearch } from "@tabler/icons-react"

export default function SearchPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Search Portal</h2>
          <p className="text-muted-foreground">
            Use search queries to find resources, documents, events, webinars, or admin configurations.
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
              <li>Search API Endpoint: Implement `GET /api/search?q=query` to perform full-text searching across tables (Events, Webinars, Resources, Announcements).</li>
              <li>Granular Access Controls: Filter search outcomes by user role. If a General member searches, hide results tagging to Pastoral or Board only.</li>
              <li>Frontend Debouncing: Setup a search input field with standard React debouncing (e.g. using `use-debouncy` or custom timeout hook) to avoid overloading the API on keystrokes.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search Input Bar Mock */}
      <div className="rounded-lg border bg-card p-6 max-w-2xl space-y-4">
        <div className="flex items-center gap-2 rounded border bg-secondary/30 px-3 py-2">
          <IconSearch className="size-5 text-muted-foreground" />
          <input type="text" placeholder="Type keywords to search..." className="w-full bg-transparent text-sm focus:outline-none" />
        </div>
      </div>
    </div>
  )
}
