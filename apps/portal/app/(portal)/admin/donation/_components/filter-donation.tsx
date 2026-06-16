"use client"

import React from "react"
import { Search, Calendar as CalendarIcon, DollarSign } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Card, CardContent } from "@workspace/ui/components/card"
import { useDonationStore } from "@/store/use-donation-store"

export function DonationFilter() {
  const {
    searchQuery,
    selectedTier,
    selectedDate,
    minAmount,
    maxAmount,
    setSearchQuery,
    setSelectedTier,
    setSelectedDate,
    setMinAmount,
    setMaxAmount,
  } = useDonationStore()

  return (
    <Card className="border-[oklch(0.9355_0.0324_80.9937)] bg-white shadow-xs">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-[oklch(0.9355_0.0324_80.9937)] bg-amber-50/20 pl-9"
            />
          </div>

          <div className="flex w-full flex-wrap items-center justify-end gap-3 lg:w-auto">
            {/* Amount Inputs */}
            <div className="flex items-center gap-2 rounded-md border border-gray-100 bg-gray-50 p-1">
              <span className="flex items-center gap-0.5 px-1 text-xs text-muted-foreground">
                <DollarSign size={12} /> Amount:
              </span>
              <Input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="h-7 w-16 text-xs"
              />
              <span className="text-xs text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="h-7 w-16 text-xs"
              />
            </div>

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 gap-2 text-xs">
                  <CalendarIcon size={14} />
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Filter Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </PopoverContent>
            </Popover>

            {/* Tier Filter */}
            <div className="flex h-9 items-center gap-1 rounded-md bg-gray-100 p-1 text-xs">
              {["All", "General", "Pastoral", "Board"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`rounded px-3 py-1 transition-colors ${
                    selectedTier === tier
                      ? "bg-[oklch(0.4650_0.1470_24.9381)] text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
