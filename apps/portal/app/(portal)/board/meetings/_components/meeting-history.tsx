"use client"
import { useMemo, useState } from "react"
import { useMeetingStore } from "@/store/use-bord-meeting-store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { IconDownload, IconEye, IconSettings } from "@tabler/icons-react"

export const MeetingTable = () => {
  const { meetings, updateStatus, searchQuery, filterStatus } =
    useMeetingStore()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      const matchesSearch = m.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesFilter = filterStatus === "All" || m.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [meetings, searchQuery, filterStatus])

  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage)
  const paginatedData = filteredMeetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Table Header */}
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Meeting History
        </h3>
        <p className="text-sm text-slate-500">
          Access and manage all historical board meeting documents.
        </p>
      </div>

      {/* Table Body */}
      {paginatedData.map((meeting) => (
        <div
          key={meeting.id}
          className="flex items-center justify-between border-b border-slate-100 px-6 py-4 transition-colors hover:bg-slate-50/80"
        >
          <div>
            <p className="font-semibold text-slate-900">{meeting.title}</p>
            <p className="text-sm text-slate-500">{meeting.date}</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant={meeting.status === "Public" ? "default" : "secondary"}
              className="w-20 justify-center rounded-full"
            >
              {meeting.status}
            </Badge>

            {/* View & Download Buttons */}
            <div className="flex items-center gap-1 border-l pl-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 hover:text-primary"
              >
                <IconEye size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 hover:text-primary"
              >
                <IconDownload size={18} />
              </Button>
            </div>

            {/* Status Change Select */}
            <Select
              value={meeting.status}
              onValueChange={(val: any) => updateStatus(meeting.id, val)}
            >
              <SelectTrigger className="w-32 border-slate-200 shadow-none hover:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-between bg-slate-50/50 px-6 py-4">
        <span className="text-sm text-slate-500">
          Showing page {currentPage} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
