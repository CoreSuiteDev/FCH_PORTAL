"use client"

import React, { useState } from "react"
import { IconBell, IconLoader } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { toast } from "@workspace/ui/components/sonner"

export function NotificationSettings() {
  const [announcements, setAnnouncements] = useState(true)
  const [newsletter, setNewsletter] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSaving(false)
    toast.success("Notification preferences updated successfully.")
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xs space-y-6">
      <h3 className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3 text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
        <IconBell className="size-5 text-slate-500" /> Notifications Configuration
      </h3>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Urgent Member Announcements
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Receive instant email updates for critical alerts and diocese announcements.
            </p>
          </div>
          <Switch checked={announcements} onCheckedChange={setAnnouncements} />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-900 pt-5">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Monthly FCH Connection Newsletters
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Receive newsletters, update reports, and notifications about new pastoral resources.
            </p>
          </div>
          <Switch checked={newsletter} onCheckedChange={setNewsletter} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold px-4 py-2 cursor-pointer h-9"
        >
          {isSaving ? (
            <>
              <IconLoader className="mr-2 size-4 animate-spin" />
              Saving Preferences...
            </>
          ) : (
            "Save Notifications"
          )}
        </Button>
      </div>
    </div>
  )
}
