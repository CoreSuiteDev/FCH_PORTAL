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

interface NewsFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  selectedStatus: string
  onStatusChange: (value: string) => void
}

export function NewsFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
}: NewsFiltersProps) {
  return (
    <Card className="border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
      <CardContent className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search news titles or slug terms..."
            className="h-10 w-full border-slate-200 bg-white pl-9 shadow-none focus-visible:border-slate-300 focus-visible:ring-rose-800/10 dark:bg-slate-800"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <Filter className="h-3.5 w-3.5" /> Filter Type:
          </div>
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="h-10 w-[140px] border-slate-200 shadow-none">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="NEWS">News</SelectItem>
              <SelectItem value="BLOG">Blog</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-10 w-[140px] border-slate-200 shadow-none">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="REVIEW">Review</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
