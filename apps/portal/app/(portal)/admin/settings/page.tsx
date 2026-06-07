import React from "react"
import { IconSettings, IconInfoCircle } from "@tabler/icons-react"

export default function AdminSettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Protected Settings</h2>
          <p className="text-muted-foreground">
            Configure global portal parameters, Stripe credentials, Okta configurations, and billing grace periods.
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
              <li>Environment settings: Secure configurations for API keys, Stripe webhooks, and Okta tenant IDs.</li>
              <li>Billing rules config: Define grace period parameters for failed payments (e.g. 7 days before removing from Okta paid group).</li>
              <li>Setup global state parameters stored in database configurations.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Settings Form */}
      <div className="rounded-lg border bg-card p-6 space-y-6 max-w-2xl">
        <h3 className="text-lg font-bold tracking-tight border-b pb-2 flex items-center gap-2">
          <IconSettings className="size-5" /> Global Parameters
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Stripe Webhook Secret Key</label>
            <input type="password" value="whsec_xxxxxxxxxxxxxxxxxxxxxx" disabled className="w-full rounded border p-2 text-sm bg-secondary/30 text-muted-foreground cursor-not-allowed" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Okta API Token</label>
            <input type="password" value="okta_tok_xxxxxxxxxxxxxxxxxxx" disabled className="w-full rounded border p-2 text-sm bg-secondary/30 text-muted-foreground cursor-not-allowed" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Failed Payment Grace Period (Days)</label>
            <input type="number" defaultValue={7} className="w-full rounded border p-2 text-sm bg-secondary/50 focus:outline-none" />
            <p className="text-[10px] text-muted-foreground">Grace period before users are downgraded on failed payment events.</p>
          </div>
        </div>

        <button className="rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  )
}