"use client"

import React, { useState } from "react"
import { Input } from "@workspace/ui/components/input"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { IconSearch, IconInbox } from "@tabler/icons-react"
import { useNewsList } from "@/hooks/useNews"
import { ZTCNewsOutput } from "@workspace/types"
import { NewsHeader } from "./_components/news-header"
import { NewsCard } from "./_components/news-card"
import { NewsTodo } from "./_components/news-todo"

export type NewsItem = ZTCNewsOutput

export default function NewsArchivePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "NEWS" | "ANNOUNCEMENT">("all")

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: newsData, isLoading } = useNewsList({
    page: 1,
    limit: 50,
    status: "PUBLISHED",
    newsType: activeTab === "all" ? undefined : activeTab,
    search: debouncedSearch || undefined,
  })

  const filteredNews = newsData?.data ?? []

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 min-h-screen bg-slate-50/50 dark:bg-slate-900/40">
      <NewsHeader />

      <NewsTodo />

      {/* Search and Tabs Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-muted p-1 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg text-xs font-bold px-4 py-1.5 cursor-pointer">
              All Publications
            </TabsTrigger>
            <TabsTrigger value="NEWS" className="rounded-lg text-xs font-bold px-4 py-1.5 cursor-pointer">
              News
            </TabsTrigger>
            <TabsTrigger value="ANNOUNCEMENT" className="rounded-lg text-xs font-bold px-4 py-1.5 cursor-pointer">
              Announcements
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-80">
          <IconSearch className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-slate-200 dark:border-slate-800 rounded-xl bg-card"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card p-6 space-y-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-8 w-full rounded-xl mt-2" />
            </div>
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-24 text-center bg-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground/60">
            <IconInbox className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">No publications found</p>
            <p className="text-xs text-muted-foreground">
              {searchQuery ? "Try adjusting your search query." : "No published news or announcements yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
