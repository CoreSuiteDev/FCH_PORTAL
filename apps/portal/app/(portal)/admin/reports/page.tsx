import { IconInfoCircle } from "@tabler/icons-react"

export default function AdminReportsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h2>
          <p className="text-muted-foreground">
            Generate portal usage reports, download metrics, and member logs.
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
                Query portal logs: Fetch user login histories, resource download
                tallies, and active page views.
              </li>
              <li>
                Chart integration: Render graphical dashboards using Recharts to
                visualize user activity levels.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Reports List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">
          Available Reports
        </h3>
        <p className="text-sm text-muted-foreground">
          Select a report module to view metrics.
        </p>
      </div>
    </div>
  )
}
