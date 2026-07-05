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
import Image from "next/image"
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
  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Loader2 className="h-10 w-10 animate-spin text-slate-500" />
            <p className="text-sm font-medium text-slate-500">Loading events...</p>
          </div>
        ) : isError ? (
          <div className="m-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50/20 py-20">
            <ShieldAlert className="h-10 w-10 text-rose-500" />
            <h4 className="text-base font-bold text-slate-800">Connection Failed</h4>
            <p className="text-xs text-slate-500">Could not fetch events. Please retry.</p>
            <Button variant="outline" onClick={onRetry} className="mt-2 h-8">
              Retry
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 p-6 text-sm text-slate-400">
            <CalendarDays className="h-8 w-8 text-slate-300" />
            No events found matching current filters.
          </div>
        ) : (
          <div className="block overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-slate-800/40">
                <TableRow>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Event</TableHead>
                  {!hideTypeColumn && (
                    <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Type</TableHead>
                  )}
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Visibility</TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Location</TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Capacity</TableHead>
                  <TableHead className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow
                    key={event.id}
                    className="border-b border-slate-100 hover:bg-slate-50/40 dark:border-slate-900"
                  >
                    {/* Event Title + Cover */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {event.coverImage ? (
                          <Image
                            src={event.coverImage}
                            alt={event.title}
                            width={40}
                            height={40}
                            className="shrink-0 rounded border bg-slate-50 object-cover"
                          />
                        ) : (
                          <div className="flex size-10 shrink-0 items-center justify-center rounded border bg-slate-50 text-slate-400 dark:bg-slate-900">
                            <CalendarDays className="size-4" />
                          </div>
                        )}
                        <div>
                          <div className="line-clamp-1 font-semibold text-slate-900 dark:text-slate-100">
                            {event.title}
                          </div>
                          {event.description && (
                            <div className="line-clamp-1 text-xs text-slate-400">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Type */}
                    {!hideTypeColumn && (
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold ${TYPE_COLORS[event.eventType]}`}
                        >
                          {event.eventType === "WEBINAR" ? (
                            <>
                              <Video className="mr-1 size-2.5" />
                              {event.eventType}
                            </>
                          ) : (
                            <>
                              <CalendarDays className="mr-1 size-2.5" />
                              {event.eventType}
                            </>
                          )}
                        </Badge>
                      </TableCell>
                    )}

                    {/* Status */}
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] font-bold capitalize ${STATUS_COLORS[event.status]}`}
                      >
                        {event.status.toLowerCase()}
                      </Badge>
                    </TableCell>

                    {/* Visibility */}
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${VISIBILITY_COLORS[event.visibility]}`}
                      >
                        {event.visibility === "PUBLIC" ? (
                          <>
                            <Globe className="mr-1 size-2.5" />
                            Public
                          </>
                        ) : event.visibility === "MEMBER_ONLY" ? (
                          <>
                            <Users className="mr-1 size-2.5" />
                            Members
                          </>
                        ) : (
                          <>
                            <EyeOff className="mr-1 size-2.5" />
                            {event.visibility.replace(/_/g, " ")}
                          </>
                        )}
                      </Badge>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-slate-500">
                      {formatDate(event.startDate)}
                      {event.endDate && (
                        <span className="block text-slate-400">
                          → {formatDate(event.endDate)}
                        </span>
                      )}
                    </TableCell>

                    {/* Location */}
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <MapPin className="size-3 text-slate-400" />
                        <span className="max-w-[120px] truncate">{event.location}</span>
                      </span>
                    </TableCell>

                    {/* Capacity */}
                    <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-slate-500">
                      {event.maxCapacity ? (
                        <span className="flex items-center gap-1">
                          <Users className="size-3 text-slate-400" />
                          {event.maxCapacity}
                        </span>
                      ) : (
                        <span className="text-slate-300">Unlimited</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:cursor-pointer"
                          onClick={() => onEdit(event)}
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:cursor-pointer hover:bg-red-50 hover:text-red-600"
                          onClick={() => onDelete(event.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/50 p-4">
          <span className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 text-xs hover:cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-8 text-xs hover:cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
