"use client"

import React, { useState } from "react"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { IconMailCheck } from "@tabler/icons-react"

export function NewsHeader() {
  const [subscribed, setSubscribed] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  const handleToggleSubscription = async (checked: boolean) => {
    setIsSyncing(true)
    setStatusMsg(null)
    
    // Simulating future Mailchimp API integration / subscriber sync
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSubscribed(checked)
    setIsSyncing(false)
    setStatusMsg(checked ? "Subscribed successfully!" : "Unsubscribed successfully.")
    
    // Auto-clear message
    setTimeout(() => {
      setStatusMsg(null)
    }, 3000)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          News &amp; Publication Archive
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
          Browse through past editions of FCH Connection newsletters and official press releases.
        </p>
      </div>

      <div className="flex flex-col gap-1 items-end shrink-0">
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IconMailCheck className="size-5" />
          </div>
          <div className="space-y-0.5 mr-4 col-span-2">
            <Label htmlFor="newsletter-sync" className="text-xs font-bold cursor-pointer">
              Newsletter Subscription
            </Label>
            <p className="text-[10px] text-muted-foreground">
              {isSyncing ? "Syncing status..." : subscribed ? "Subscribed to updates" : "Notifications off"}
            </p>
          </div>
          <Switch
            id="newsletter-sync"
            checked={subscribed}
            onCheckedChange={handleToggleSubscription}
            disabled={isSyncing}
            className="cursor-pointer"
          />
        </div>
        {statusMsg && (
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 mr-2 animate-pulse">
            {statusMsg}
          </span>
        )}
      </div>
    </div>
  )
}
