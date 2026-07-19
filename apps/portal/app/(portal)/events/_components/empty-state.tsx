import React from "react"
import { IconCalendarEvent } from "@tabler/icons-react"

interface EmptyStateProps {
  activeTab: "all" | "registered" | "webinars"
}

export function EmptyState({ activeTab }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-2xl p-8 space-y-4">
      <div className="p-4 bg-muted/50 rounded-full text-muted-foreground">
        <IconCalendarEvent className="size-10" />
      </div>
      <h3 className="text-lg font-bold">No events found</h3>
      <p className="text-muted-foreground text-sm max-w-sm">
        {activeTab === "registered"
          ? "You haven't registered for any events yet. Check the 'All Events' tab to explore and register."
          : activeTab === "webinars"
          ? "There are currently no upcoming webinars available for registration."
          : "No upcoming events match your membership view levels."}
      </p>
    </div>
  )
}
