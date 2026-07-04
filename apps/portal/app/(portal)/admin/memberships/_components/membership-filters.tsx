"use client"

import React from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

interface MembershipFiltersProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  selectedTier: string
  setSelectedTier: (val: string) => void
  selectedStatus: string
  setSelectedStatus: (val: string) => void
}

export const MembershipFilters = ({
  searchQuery,
  setSearchQuery,
  selectedTier,
  setSelectedTier,
  selectedStatus,
  setSelectedStatus,
}: MembershipFiltersProps) => {
  return (
    <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-slate-400" />
            <Input
              placeholder="Search by member name, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 border-slate-200 bg-white focus-visible:ring-rose-800/10 focus-visible:border-slate-300 shadow-none dark:border-slate-800"
            />
          </div>

          {/* Filter controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Tier:</span>
            </div>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-[140px] h-10 border-slate-200 shadow-none capitalize">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Tiers</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Pastoral">Pastoral</SelectItem>
                <SelectItem value="Board">Board</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-xs font-medium text-slate-500">Status:</span>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px] h-10 border-slate-200 shadow-none capitalize">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
