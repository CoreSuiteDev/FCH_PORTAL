"use client"

import React, { useState } from "react"
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

  const [openTier, setOpenTier] = useState(false)
  const [openSponsor, setOpenSponsor] = useState(false)
  const [openDate, setOpenDate] = useState(false)

  const tiers = ["All", "General", "Pastoral", "Board"]
  const sponsorships = [
    "All",
    "Diamond",
    "Platinum",
    "Gold",
    "Silver",
    "Bronze",
  ]

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 focus-visible:ring-rose-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-1">
              <DollarSign size={12} className="ml-1 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="h-7 w-16 border-none bg-transparent text-xs shadow-none"
              />
              <span className="text-slate-300">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
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
                      {sponsorships.map((s) => (
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
  )
}
