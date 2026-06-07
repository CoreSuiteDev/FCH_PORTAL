import { IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react"

export default function AdminBoardManagementPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Board Access Management
          </h2>
          <p className="text-muted-foreground">
            Manually grant or revoke board member access rights for portal
            tools.
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
                Okta Groups sync: Build backend endpoints (`POST
                /api/admin/board/assign` and `POST /api/admin/board/revoke`).
              </li>
              <li>
                When toggled to enabled, call the Okta API to add the user to
                the `Board Member` group. When disabled, remove them.
              </li>
              <li>
                Display users list: Fetch members list from database, filtering
                by those who have requested board access or are eligible.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Caution Alert */}
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-foreground">
        <div className="flex items-start gap-3">
          <IconAlertTriangle className="mt-0.5 size-5 shrink-0 text-red-500" />
          <div>
            <h4 className="font-semibold text-red-500">Security Warning:</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Board Access grants full permission to read confidential FCH
              documents, audits, and meeting resolutions. Verify credentials
              carefully before granting.
            </p>
          </div>
        </div>
      </div>

      {/* Mock Members directory */}
      <div className="space-y-4">
        {[
          {
            name: "Sarah Jenkins",
            email: "s.jenkins@fch.org",
            role: "Board Member",
            hasAccess: true,
          },
          {
            name: "Fr. Robert Davis",
            email: "r.davis@diocese.org",
            role: "Pastoral Member",
            hasAccess: false,
          },
        ].map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 rounded-lg border bg-card p-6 shadow-xs"
          >
            <div>
              <h4 className="text-sm font-bold tracking-tight">{user.name}</h4>
              <p className="text-xs text-muted-foreground">
                {user.email} • Current Tier: {user.role}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Grant Board Access:
              </span>
              <input
                type="checkbox"
                defaultChecked={user.hasAccess}
                className="size-4 cursor-pointer rounded accent-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
