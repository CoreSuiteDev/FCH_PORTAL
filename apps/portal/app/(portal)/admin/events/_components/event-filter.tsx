"use client"

import { Calendar as CalendarIcon, Search } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Input } from "@workspace/ui/components/input"
import { useEventStore } from "@/store/use-event-store"

export default function EventsFilter() {
  const {
    search,
    setSearch,
    filter,
    setFilter,
    selectedDate,
    setSelectedDate,
  } = useEventStore()

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-slate-50 p-4">
      <div className="relative min-w-[250px] flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white pl-9"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start bg-white text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              dateFormatter.format(new Date(selectedDate))
            ) : (
              <span>Filter by date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate ? new Date(selectedDate) : undefined}
            onSelect={(date) =>
              setSelectedDate(date ? date.toDateString() : "")
            }
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2">
        {["All", "General", "Pastoral", "Board"].map((tier) => (
          <Button
            key={tier}
            variant={filter === tier ? "default" : "outline"}
            onClick={() => setFilter(tier)}
            size="sm"
          >
            {tier}
          </Button>
        ))}
      </div>
    </div>
  )
}
