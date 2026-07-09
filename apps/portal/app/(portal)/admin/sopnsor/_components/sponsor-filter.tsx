"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
  Search,
  Calendar as CalendarIcon,
  DollarSign,
  ChevronDown,
  Check,
} from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"

import { useSponsorStore } from "@/store/use-sponsor-store"
import { cn } from "@workspace/ui/lib/utils"
import { useFilterSponsorship } from "@/hooks/useSponsor"
import { useSponsorPlans } from "@/hooks/useSponsorPlan"

export function SponsorFilter() {
  const {
    searchQuery,
    selectedTier,
    selectedSponsorship,
    selectedDate,
    minAmount,
    maxAmount,
    setSearchQuery,
    setSelectedTier,
    setSelectedSponsorship,
    setSelectedDate,
    setMinAmount,
    setMaxAmount,
  } = useSponsorStore()

  // Local state for immediate typing (to support debouncing)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [localMin, setLocalMin] = useState(minAmount)
  const [localMax, setLocalMax] = useState(maxAmount)

  const [openTier, setOpenTier] = useState(false)
  const [openSponsor, setOpenSponsor] = useState(false)
  const [openDate, setOpenDate] = useState(false)

  // Debouncing Search Query (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 500)
    return () => clearTimeout(handler)
  }, [localSearch, setSearchQuery])

  // Debouncing Min Amount Query (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setMinAmount(localMin)
    }, 500)
    return () => clearTimeout(handler)
  }, [localMin, setMinAmount])

  // Debouncing Max Amount Query (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setMaxAmount(localMax)
    }, 500)
    return () => clearTimeout(handler)
  }, [localMax, setMaxAmount])

  // Fetch all sponsor plans dynamically from API
  const { data: sponsorPlans } = useSponsorPlans()

  // Extract unique tiers from the API plans data
  const sponsorTiers = useMemo(() => {
    if (!sponsorPlans || sponsorPlans.length === 0) {
      return ["All", "Diamond", "Platinum", "Gold", "Silver", "Bronze"]
    }
    const uniqueTiers = Array.from(
      new Set(sponsorPlans.map((p) => p.tier.charAt(0) + p.tier.slice(1).toLowerCase()))
    )
    return ["All", ...uniqueTiers]
  }, [sponsorPlans])

  // Call the sponsor filter api in this file using TanStack Query
  const { data: filteredData } = useFilterSponsorship({
    page: 1,
    limit: 10,
    search: searchQuery,
    tier: selectedSponsorship === "All" ? undefined : selectedSponsorship,
    role: selectedTier === "All" ? undefined : selectedTier,
    minAmount: minAmount ? Number(minAmount) : undefined,
    maxAmount: maxAmount ? Number(maxAmount) : undefined,
    startDate: selectedDate ? selectedDate.toISOString() : undefined,
  })

  const tiers = ["All", "General", "Pastoral", "Board"]

  return (
    <section>
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, or ID..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="h-9 pl-9 focus-visible:ring-rose-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-1">
                <DollarSign size={12} className="ml-1 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Min"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  className="h-7 w-16 border-none bg-transparent text-xs shadow-none"
                />
                <span className="text-slate-300">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  className="h-7 w-16 border-none bg-transparent text-xs shadow-none"
                />
              </div>

              <Popover open={openTier} onOpenChange={setOpenTier}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 gap-2 text-xs",
                      openTier && "border-rose-600 ring-1 ring-rose-600"
                    )}
                  >
                    {selectedTier} Role <ChevronDown size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-1">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {tiers.map((t) => (
                          <CommandItem
                            key={t}
                            onSelect={() => {
                              setSelectedTier(t)
                              setOpenTier(false)
                            }}
                            className="cursor-pointer hover:bg-rose-50 hover:text-rose-600 data-[selected=true]:bg-rose-50 data-[selected=true]:text-rose-600"
                          >
                            {selectedTier === t && (
                              <Check className="mr-2 h-4 w-4 text-rose-600" />
                            )}
                            {t}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover open={openSponsor} onOpenChange={setOpenSponsor}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 gap-2 text-xs",
                      openSponsor && "border-rose-600 ring-1 ring-rose-600"
                    )}
                  >
                    {selectedSponsorship} Tier <ChevronDown size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-1">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {sponsorTiers.map((s) => (
                          <CommandItem
                            key={s}
                            onSelect={() => {
                              setSelectedSponsorship(s)
                              setOpenSponsor(false)
                            }}
                            className="cursor-pointer hover:bg-rose-50 hover:text-rose-600 data-[selected=true]:bg-rose-50 data-[selected=true]:text-rose-600"
                          >
                            {selectedSponsorship === s && (
                              <Check className="mr-2 h-4 w-4 text-rose-600" />
                            )}
                            {s}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover open={openDate} onOpenChange={setOpenDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 gap-2 text-xs",
                      openDate && "border-rose-600 ring-1 ring-rose-600"
                    )}
                  >
                    <CalendarIcon size={14} />
                    {selectedDate ? selectedDate.toLocaleDateString() : "Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      setOpenDate(false)
                    }}
                    className="[&_.rdp-day_button:hover]:bg-rose-50 [&_.rdp-day_button:hover]:text-rose-600 [&_.rdp-selected]:bg-rose-600"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
