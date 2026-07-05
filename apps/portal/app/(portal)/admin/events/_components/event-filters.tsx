import { Filter, Search } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

interface EventFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  selectedStatus: string
  onStatusChange: (value: string) => void
  hideTypeFilter?: boolean
}

export function EventFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  hideTypeFilter = false,
}: EventFiltersProps) {
  return (
    <Card className="border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
      <CardContent className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by title or location..."
            className="h-10 w-full border-slate-200 bg-white pl-9 shadow-none dark:bg-slate-800"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </div>

          {!hideTypeFilter && (
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="h-10 w-[140px] border-slate-200 shadow-none">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="EVENT">Event</SelectItem>
                <SelectItem value="WEBINAR">Webinar</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-10 w-[140px] border-slate-200 shadow-none">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="UPCOMING">Upcoming</SelectItem>
              <SelectItem value="ONGOING">Ongoing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
