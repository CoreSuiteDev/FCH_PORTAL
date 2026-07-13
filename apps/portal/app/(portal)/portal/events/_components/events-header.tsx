import React from "react"

interface EventsHeaderProps {
  userName?: string
  totalAvailable: number
  registeredCount: number
  webinarCount: number
}

export function EventsHeader({ userName, totalAvailable, registeredCount, webinarCount }: EventsHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-linear-to-r from-primary/5 via-primary/10 to-transparent p-8">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Member Events & Webinars
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Welcome, <span className="font-semibold text-foreground">{userName || "Member"}</span>. Register for upcoming summits, leadership training, workshops, and pastoral webinars.
          </p>
        </div>
        <div className="hidden lg:flex shrink-0 p-4 bg-background/50 backdrop-blur-md border rounded-xl shadow-xs gap-4 text-xs font-medium">
          <div className="text-center px-4 py-1 border-r">
            <div className="text-xl font-bold text-primary">{totalAvailable}</div>
            <div className="text-muted-foreground">Available</div>
          </div>
          <div className="text-center px-4 py-1 border-r">
            <div className="text-xl font-bold text-emerald-500">{registeredCount}</div>
            <div className="text-muted-foreground">Registered</div>
          </div>
          <div className="text-center px-4 py-1">
            <div className="text-xl font-bold text-sky-500">{webinarCount}</div>
            <div className="text-muted-foreground">Webinars</div>
          </div>
        </div>
      </div>
    </div>
  )
}
