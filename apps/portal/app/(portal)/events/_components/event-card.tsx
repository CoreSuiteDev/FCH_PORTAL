import {
  IconBook,
  IconCheck,
  IconClock,
  IconLink,
  IconLoader,
  IconMapPin,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react"
import Link from "next/link"

interface EventCardProps {
  event: any
  isRegistered: boolean
  isCheckedIn: boolean
  isMutating: boolean
  handleRegister: (eventId: string) => void
  handleCheckIn: (eventId: string) => void
  formatDateRange: (start: Date | string, end?: Date | string | null) => string
}

export function EventCard({
  event,
  isRegistered,
  isCheckedIn,
  isMutating,
  handleRegister,
  handleCheckIn,
  formatDateRange,
}: EventCardProps) {
  const isWebinar = event.eventType === "WEBINAR"

  const getVisibilityBadgeColor = (visibility: string) => {
    switch (visibility) {
      case "PUBLIC":
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
      case "FREE_WEBINAR":
        return "bg-sky-500/10 text-sky-500 border-sky-500/20"
      case "MEMBER_ONLY":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
      case "PASTORAL_ONLY":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "BOARD_ONLY":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "PUBLIC":
        return "Public"
      case "FREE_WEBINAR":
        return "Free Webinar"
      case "MEMBER_ONLY":
        return "General Member"
      case "PASTORAL_ONLY":
        return "Pastoral Only"
      case "BOARD_ONLY":
        return "Board Members"
      default:
        return visibility
    }
  }

  return (
    <div className="group relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-2xl border bg-card p-6 shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-md">
      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${getVisibilityBadgeColor(
              event.visibility
            )}`}
          >
            {getVisibilityLabel(event.visibility)}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
              isWebinar
                ? "border-sky-500/20 bg-sky-500/10 text-sky-500"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
            }`}
          >
            {isWebinar ? "Webinar" : "Summit/Event"}
          </span>
        </div>

        <Link href={`/portal/events/${event.id}`}>
          <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary cursor-pointer hover:underline">
            {event.title}
          </h3>
        </Link>

        <p className="line-clamp-4 text-xs leading-relaxed text-muted-foreground">
          {event.description}
        </p>
      </div>

      {/* Metadata: Date, Location, Speakers */}
      <div className="space-y-2.5 border-t border-muted/50 pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <IconClock className="size-4 shrink-0 text-primary" />
          <span className="line-clamp-2">
            {formatDateRange(event.startDate, event.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isWebinar ? (
            <IconVideo className="size-4 shrink-0 text-sky-500" />
          ) : (
            <IconMapPin className="size-4 shrink-0 text-amber-500" />
          )}
          <span className="truncate">{event.location}</span>
        </div>
        {event.maxCapacity && (
          <div className="flex items-center gap-1.5">
            <IconUsers className="size-4 shrink-0 text-indigo-500" />
            <span>
              Capacity: <span className="font-semibold text-foreground">{event.currentCount || 0} / {event.maxCapacity}</span>
            </span>
          </div>
        )}
        {isWebinar &&
          event.webinar?.speakers &&
          event.webinar.speakers.length > 0 && (
            <div className="flex items-start gap-1.5">
              <IconUsers className="mt-0.5 size-4 shrink-0 text-indigo-500" />
              <span className="line-clamp-2">
                Speakers:{" "}
                <span className="font-semibold text-foreground">
                  {event.webinar.speakers.join(", ")}
                </span>
              </span>
            </div>
          )}
      </div>

      {/* Actions Section */}
      <div className="flex w-full flex-col gap-2.5 border-t border-muted/50 pt-3">
        <div className="flex min-h-[24px] w-full items-center justify-between">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            {isWebinar ? "Live Zoom Link" : "Capacity Access"}
          </span>
          {/* Status badges */}
          {isCheckedIn ? (
            <span className="inline-flex items-center justify-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
              <IconCheck className="size-3" /> Checked In
            </span>
          ) : isRegistered ? (
            <span className="inline-flex items-center justify-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600">
              <IconCheck className="size-3" /> Registered
            </span>
          ) : null}
        </div>

        {!isRegistered ? (
          <button
            onClick={() => handleRegister(event.id)}
            disabled={isMutating}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-xs transition-all duration-200 hover:bg-primary/95 active:scale-98 disabled:opacity-50"
          >
            {isMutating ? (
              <IconLoader className="size-4 animate-spin" />
            ) : (
              <IconBook className="size-4" />
            )}
            Register Now
          </button>
        ) : !isCheckedIn ? (
          <button
            onClick={() => handleCheckIn(event.id)}
            disabled={isMutating}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-emerald-500 active:scale-98 disabled:opacity-50"
          >
            {isMutating ? (
              <IconLoader className="size-4 animate-spin" />
            ) : (
              <IconCheck className="size-4" />
            )}
            Check In
          </button>
        ) : event.meetingLink ? (
          <a
            href={event.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full animate-pulse cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-sky-400 hover:shadow-md active:scale-98"
          >
            <IconLink className="size-4" />
            Join Online
          </a>
        ) : (
          <button
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border bg-muted px-4 py-2.5 text-xs font-bold text-muted-foreground"
          >
            <IconCheck className="size-4" />
            Attendance Confirmed
          </button>
        )}
      </div>
    </div>
  )
}
