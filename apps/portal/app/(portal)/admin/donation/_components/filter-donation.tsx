"use client"

import React, { useState, useEffect } from "react"
import { Search, Calendar as CalendarIcon, DollarSign, X } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Card, CardContent } from "@workspace/ui/components/card"
import { useDonationStore } from "@/store/use-donation-store"
import { useFilterDonations } from "@/hooks/useDonation"

const TIERS = ["All", "General", "Pastoral", "Board", "Guest"] as const;

export function DonationFilter() {
  const {
    searchQuery, selectedTier, selectedDate, minAmount, maxAmount,
    setSearchQuery, setSelectedTier, setSelectedDate, setMinAmount, setMaxAmount
  } = useDonationStore()

  const [localFilters, setLocalFilters] = useState({
    search: searchQuery,
    min: minAmount,
    max: maxAmount,
  })

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localFilters.search)
      setMinAmount(localFilters.min)
      setMaxAmount(localFilters.max)
    }, 500)

    return () => clearTimeout(handler)
  }, [localFilters.search, localFilters.min, localFilters.max, setSearchQuery, setMinAmount, setMaxAmount])


  const handleInputChange = (field: keyof typeof localFilters, value: string) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedTier("All")
    setSelectedDate(undefined)
    setMinAmount("")
    setMaxAmount("")
    setLocalFilters({ search: "", min: "", max: "" })
  }


  const hasActiveFilters = searchQuery || selectedTier !== "All" || selectedDate || minAmount || maxAmount


  const { data: filteredData } = useFilterDonations({
    page: 1,
    limit: 10,
    search: searchQuery,
    role: selectedTier === "All" ? undefined : selectedTier,
    minAmount: minAmount ? Number(minAmount) : undefined,
    maxAmount: maxAmount ? Number(maxAmount) : undefined,
    createdAt: selectedDate ? selectedDate.toISOString() : undefined,
  })

  return (
    <Card className="border-amber-200/60 bg-white shadow-xs">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or ID..."
              value={localFilters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
              className="border-amber-200/60 bg-amber-50/20 pl-9"
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
                value={localFilters.min}
                onChange={(e) => handleInputChange("min", e.target.value)}
                className="h-7 w-16 text-xs"
              />
              <span className="text-xs text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={localFilters.max}
                onChange={(e) => handleInputChange("max", e.target.value)}
                className="h-7 w-16 text-xs"
              />
            </div>

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 gap-2 text-xs hover:cursor-pointer">
                  <CalendarIcon size={14} />
                  {selectedDate ? selectedDate.toLocaleDateString() : "Filter Date"}
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
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`rounded px-3 py-1 transition-colors hover:cursor-pointer ${
                    selectedTier === tier
                      ? "bg-amber-950 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Clear Filter Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="h-9 px-3 gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 hover:cursor-pointer"
              >
                <X size={14} />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}