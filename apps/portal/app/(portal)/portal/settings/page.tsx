import React from "react"
import {
  IconInfoCircle,
  IconBell,
  IconLock,
  IconShieldCheck,
} from "@tabler/icons-react"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portal Settings</h2>
          <p className="text-muted-foreground">
            Configure your notification preferences, theme choices, and security
            options.
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
                Notification integrations: Store email subscription choices
                inside database user settings meta.
              </li>
              <li>
                In-Dashboard Password Change: Setup submit handler for the
                Change Password form below. Send a POST request to
                `/api/user/change-password`.
              </li>
              <li>
                {`Backend Okta Integration: In /api/user/change-password,
                retrieve the logged-in user's Okta ID. Use the Okta Management
                SDK (oktaClient.userApi.changePassword) to update the user's
                password directly from the backend to keep the experience
                entirely inside this portal.`}
              </li>
              <li>
                Theme config toggling: Wire theme selection inputs to standard
                next-themes context.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Notifications Card */}
        <div className="space-y-6 rounded-lg border bg-card p-6">
          <h3 className="flex items-center gap-2 border-b pb-2 text-base font-bold tracking-tight">
            <IconBell className="size-5" /> Notifications Configuration
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">
                  Urgent Member Announcements
                </h4>
                <p className="text-xs text-muted-foreground">
                  Receive instant email updates for critical alerts.
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="size-4 rounded accent-primary"
              />
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <h4 className="text-sm font-semibold">
                  Monthly FCH Connection newsletters
                </h4>
                <p className="text-xs text-muted-foreground">
                  Receive newsletters about FCH resources updates.
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="size-4 rounded accent-primary"
              />
            </div>
          </div>
          <button className="rounded-md border bg-secondary px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-secondary/80">
            Save Notifications
          </button>
        </div>

        {/* Security / Password Change Card */}
        <div className="space-y-4 rounded-lg border bg-card p-6">
          <h3 className="flex items-center gap-2 border-b pb-2 text-base font-bold tracking-tight">
            <IconLock className="size-5" /> Change Password
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded border bg-secondary/50 p-2 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded border bg-secondary/50 p-2 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded border bg-secondary/50 p-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            <IconShieldCheck className="size-4" /> Update Password
          </button>
        </div>
      </div>
    </div>
  )
}
