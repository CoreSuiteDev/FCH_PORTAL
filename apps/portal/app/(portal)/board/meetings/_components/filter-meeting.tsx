"use client"
import { useMeetingStore } from "@/store/use-bord-meeting-store"
import { Input } from "@workspace/ui/components/input"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

export const MeetingFilters = () => {
  const { setSearchQuery, setFilterStatus, filterStatus } = useMeetingStore()

  return (
    <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Meeting Archive
        </h3>
        <p className="text-sm text-slate-500">
          Manage, filter, and track historical board sessions.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search meetings by title..."
          className="h-10 max-w-sm border-slate-200 bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary/20"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Tabs
          value={filterStatus}
          onValueChange={setFilterStatus}
          className="w-auto"
        >
          <TabsList className="h-10 bg-slate-100 p-1">
            {["All", "Public", "Private"].map((status) => (
              <TabsTrigger
                key={status}
                value={status}
                className="rounded-md px-6 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
