"use client"

import { useState } from "react"
import Image from "next/image"
import { useWebinarStore } from "@/store/use-webinar-store"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
  ChevronLeft,
  ChevronRight,
  User,
  Search,
  Filter,
  Activity,
  PlayCircle,
  ChevronDown,
} from "lucide-react"

export default function WebinarManager() {
  const {
    getFilteredWebinars,
    setFilterCategory,
    setFilterStatus,
    setSearchQuery,
  } = useWebinarStore()
  const [selectedTier, setSelectedTier] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const allWebinars = getFilteredWebinars()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const totalPages = Math.ceil(allWebinars.length / itemsPerPage)
  const paginatedData = allWebinars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="min-h-screen space-y-8 bg-slate-50/50 p-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900">Webinar Library</h2>
        <p className="mt-2 font-medium text-slate-500">
          Managing {allWebinars.length} active sessions.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or speaker..."
                className="w-full bg-white pl-9"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Category Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 gap-2 text-xs">
                    <Filter className="h-3.5 w-3.5" /> Category: {selectedTier}{" "}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  {["All", "Catechesis", "Hispanic Ministry"].map((cat) => (
                    <Button
                      key={cat}
                      variant="ghost"
                      className="w-full justify-start text-xs hover:bg-primary hover:text-white"
                      onClick={() => {
                        setSelectedTier(cat)
                        setFilterCategory(cat)
                      }}
                    >
                      {cat}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>

              {/* Status Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 gap-2 text-xs">
                    <Activity className="h-3.5 w-3.5" /> Status:{" "}
                    {selectedStatus} <ChevronDown className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  {["All", "Live", "Upcoming", "Recorded"].map((status) => (
                    <Button
                      key={status}
                      variant="ghost"
                      className="w-full justify-start text-xs hover:bg-primary hover:text-white"
                      onClick={() => {
                        setSelectedStatus(status)
                        setFilterStatus(status)
                      }}
                    >
                      {status}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {paginatedData.map((w) => (
          <Card
            key={w.id}
            className="group overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-200">
              <Image
                src={w.image}
                alt={w.title}
                fill
                className="mt-0 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-1 p-4">
              <Badge
                className={`${w.status === "Live" ? "bg-emerald-500" : "bg-primary"} rounded-full px-2 text-[9px] uppercase`}
              >
                {w.status}
              </Badge>
              <h3 className="text-sm leading-tight font-bold text-slate-900">
                {w.title}
              </h3>
              <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <User className="h-3 w-3" /> {w.speaker}
              </p>
              <Button className="mt-2 h-8 w-full rounded-lg bg-slate-900 text-[11px] font-semibold">
                <PlayCircle className="mr-2 h-3.5 w-3.5" /> Watch Now
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </Button>
        <span className="text-xs font-bold">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
