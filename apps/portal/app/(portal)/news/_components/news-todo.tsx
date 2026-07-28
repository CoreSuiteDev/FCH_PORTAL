"use client"

import React, { useState, useEffect } from "react"
import { IconInfoCircle, IconX } from "@tabler/icons-react"

export function NewsTodo() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault()
        setVisible((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!visible) return null

  return (
    <div className="relative rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-foreground shadow-xs">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        aria-label="Dismiss notes"
      >
        <IconX className="size-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <IconInfoCircle className="size-5" />
        </div>
        <div>
          <h4 className="font-bold text-primary text-base">
            Developer Integration Guide
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            This module is structured for easy database and marketing API synchronization. Press <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">Ctrl+D</kbd> to toggle this panel.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs text-muted-foreground">
            <li>
              <strong>News API:</strong> News items are fetched from the <code>/news</code> endpoint using <code>useNewsList</code>. Filter by <code>newsType</code> (NEWS | ANNOUNCEMENT) and <code>status=PUBLISHED</code>.
            </li>
            <li>
              <strong>Mailchimp Sync:</strong> Fetch campaigns using Mailchimp SDK (<code>/campaigns</code>) and map fields to the <code>ZTCNewsOutput</code> structure.
            </li>
            <li>
              <strong>Subscription Switch:</strong> Toggle subscriber status using Mailchimp lists member endpoints (e.g. <code>PUT /lists/[list_id]/members/[subscriber_hash]</code>).
            </li>
            <li>
              <strong>HTML Parser:</strong> Use <code>content</code> in <code>NewsletterViewer</code> to inject full campaign body previews cleanly.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
