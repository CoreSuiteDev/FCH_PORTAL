import React from "react"
import { IconCalendarEvent, IconCheck, IconVideo } from "@tabler/icons-react"

interface EventsTabsProps {
  activeTab: "all" | "registered" | "webinars"
  setActiveTab: (tab: "all" | "registered" | "webinars") => void
  registeredCount: number
  showWebinarsTab?: boolean
}

export function EventsTabs({
  activeTab,
  setActiveTab,
  registeredCount,
  showWebinarsTab = true,
}: EventsTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
      <div className="flex items-center gap-1.5 p-1 bg-muted/60 backdrop-blur-md rounded-xl border">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
            activeTab === "all"
              ? "bg-background text-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconCalendarEvent className="size-4" />
          All Events
        </button>
        <button
          onClick={() => setActiveTab("registered")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
            activeTab === "registered"
              ? "bg-background text-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconCheck className="size-4 text-emerald-500" />
          My Registrations
          {registeredCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 rounded-full">
              {registeredCount}
            </span>
          )}
        </button>
        {showWebinarsTab && (
          <button
            onClick={() => setActiveTab("webinars")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "webinars"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <IconVideo className="size-4 text-sky-500" />
            Webinars
          </button>
        )}
      </div>
    </div>
  )
}
