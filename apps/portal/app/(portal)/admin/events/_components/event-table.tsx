import {
  CalendarDays,
  Edit,
  EyeOff,
  Globe,
  Loader2,
  MapPin,
  ShieldAlert,
  Trash2,
  Users,
  Video,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import type { ZTEvent } from "@workspace/types"
import {
  STATUS_COLORS,
  TYPE_COLORS,
  VISIBILITY_COLORS,
  formatDate,
} from "./event-constants"

interface EventTableProps {
  events: ZTEvent[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onEdit: (event: ZTEvent) => void
  onDelete: (id: string) => void
  hideTypeColumn?: boolean
}

export function EventTable({
  events,
  isLoading,
  isError,
  onRetry,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  hideTypeColumn = false,
}: EventTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 bg-white border rounded-xl dark:bg-slate-950 dark:border-slate-800">
        <Loader2 className="h-10 w-10 animate-spin text-slate-500" />
        <p className="text-sm font-medium text-slate-500">Loading events...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50/20 py-20">
        <ShieldAlert className="h-10 w-10 text-rose-500" />
        <h4 className="text-base font-bold text-slate-800">Connection Failed</h4>
        <p className="text-xs text-slate-500">Could not fetch events. Please retry.</p>
        <Button variant="outline" onClick={onRetry} className="mt-2 h-8">
          Retry
        </Button>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 p-6 text-sm text-slate-400 border border-dashed rounded-xl bg-white dark:bg-slate-950">
        <CalendarDays className="h-8 w-8 text-slate-300" />
        No events found matching current filters.
      </div>
    )
  }

  const upcomingEvents = events.filter((e) => e.status === "UPCOMING")
  const ongoingEvents = events.filter((e) => e.status === "ONGOING")
  const passedEvents = events.filter((e) => e.status === "COMPLETED")

  const sections = [
    { title: "Ongoing Events", events: ongoingEvents, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
    { title: "Upcoming Events", events: upcomingEvents, color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
    { title: "Passed Events", events: passedEvents, color: "text-slate-500 bg-slate-500/10 border-slate-500/20" },
  ]

  const renderTable = (sectionEvents: ZTEvent[]) => (
    <div className="block overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50/70 dark:bg-slate-800/40">
          <TableRow>
            <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Event</TableHead>
            {!hideTypeColumn && (
              <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Type</TableHead>
            )}
            <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Visibility</TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Location</TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Capacity</TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sectionEvents.map((event) => (
            <TableRow key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {event.coverImage ? (
                    <div className="relative h-10 w-16 overflow-hidden rounded-md border shrink-0">
                      <img
                        src={event.coverImage}
                        alt={event.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-16 items-center justify-center rounded-md border bg-slate-50 text-slate-400 shrink-0">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{event.title}</div>
                    <div className="text-[10px] text-slate-500 max-w-xs truncate">{event.description}</div>
                  </div>
                </div>
              </TableCell>
              {!hideTypeColumn && (
                <TableCell className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${TYPE_COLORS[event.eventType] || ""}`}>
                    {event.eventType}
                  </span>
                </TableCell>
              )}
              <TableCell className="px-6 py-4">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${VISIBILITY_COLORS[event.visibility] || ""}`}>
                  {event.visibility.replace("_", " ")}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                {formatDate(event.startDate)}
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-slate-500 max-w-[120px] truncate">
                {event.location}
              </TableCell>
              <TableCell className="px-6 py-4 text-xs">
                {event.maxCapacity ? (
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {event.currentCount || 0} / {event.maxCapacity}
                  </span>
                ) : (
                  <span className="text-slate-400">Unlimited</span>
                )}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => onEdit(event)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(event.id)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-8">
      {sections.map(
        (sec) =>
          sec.events.length > 0 && (
            <Card key={sec.title} className="overflow-hidden border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/30">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${sec.color}`}>
                  {sec.title}
                </span>
                <span className="text-xs text-slate-400 font-medium">({sec.events.length})</span>
              </div>
              <CardContent className="p-0">{renderTable(sec.events)}</CardContent>
            </Card>
          )
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950 rounded-xl border">
          <div className="text-xs text-slate-500">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 hover:cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 hover:cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
