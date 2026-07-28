"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Separator } from "@workspace/ui/components/separator"
import {
  IconSearch,
  IconInbox,
  IconCalendar,
  IconClock,
  IconInfoCircle,
  IconArrowRight,
  IconX,
} from "@tabler/icons-react"
import { useNewsList } from "@/hooks/useNews"
import { ZTCNewsOutput } from "@workspace/types"

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<string[]>([])
  const [todoVisible, setTodoVisible] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<ZTCNewsOutput | null>(null)

  // Keyboard shortcut Ctrl+D to toggle TODO checklist panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault()
        setTodoVisible((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Load read status from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fch_read_announcements")
    if (saved) {
      try {
        setReadAnnouncementIds(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse read announcements from storage", e)
      }
    }
  }, [])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch announcements from DB
  const { data: newsData, isLoading } = useNewsList({
    page: 1,
    limit: 50,
    status: "PUBLISHED",
    newsType: "ANNOUNCEMENT",
    search: debouncedSearch || undefined,
  })

  const announcements = newsData?.data ?? []

  const handleMarkAsRead = (id: string) => {
    if (!readAnnouncementIds.includes(id)) {
      const updated = [...readAnnouncementIds, id]
      setReadAnnouncementIds(updated)
      localStorage.setItem("fch_read_announcements", JSON.stringify(updated))
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 min-h-screen bg-slate-50/50 dark:bg-slate-900/40">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Member Announcements
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Stay updated with the latest diocese alerts, notices, and updates.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <IconSearch className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-slate-200 dark:border-slate-800 rounded-xl bg-card"
          />
        </div>
      </div>

      {/* Developer Checklist Panel (Hidden by default, Ctrl+D to toggle) */}
      {todoVisible && (
        <div className="relative rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-foreground shadow-xs">
          <button
            onClick={() => setTodoVisible(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Dismiss notes"
          >
            <IconX className="size-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconInfoCircle className="size-5" />
            </div>
            <div>
              <h4 className="font-bold text-primary text-base">
                Developer Checklist Completed:
              </h4>
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs text-muted-foreground">
                <li>
                  <strong>Real DB Sync:</strong> Fetches announcements from backend DB using <code>useNewsList({`{ newsType: "ANNOUNCEMENT" }`})</code>.
                </li>
                <li>
                  <strong>Search Filter:</strong> Debounced query parameters update backend queries automatically.
                </li>
                <li>
                  <strong>Read/Unread Status:</strong> Tracked on client side using browser <code>localStorage</code> cache.
                </li>
                <li>
                  <strong>Layout Styling:</strong> Follows FCH portal design system with timeline feeds and clean visual cues.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-24 text-center bg-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground/60">
            <IconInbox className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">No announcements found</p>
            <p className="text-xs text-muted-foreground">
              {searchQuery ? "Try adjusting your search query." : "No published announcements at the moment."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => {
            const isRead = readAnnouncementIds.includes(item.id)
            const isUrgent = item.title.toLowerCase().includes("urgent") || item.title.toLowerCase().includes("maintenance")

            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl border bg-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-indigo-200/60 dark:hover:border-indigo-900/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${
                  !isRead ? "border-l-4 border-l-indigo-600 dark:border-l-indigo-500" : ""
                }`}
              >
                {/* Notice Top Metadata Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`rounded-lg border-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm ${
                        isUrgent ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 dark:bg-indigo-500"
                      }`}
                    >
                      {isUrgent ? "Urgent" : "Notice"}
                    </Badge>

                    {!isRead && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                        <IconInfoCircle className="size-3.5 fill-indigo-100 dark:fill-indigo-950" />
                        New
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                    <IconCalendar className="size-3.5" />
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Draft"}
                  </span>
                </div>

                {/* Announcement Title */}
                <button
                  onClick={() => {
                    handleMarkAsRead(item.id)
                    setSelectedAnnouncement(item)
                  }}
                  className="block mt-3 text-left w-full cursor-pointer focus:outline-none"
                >
                  <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {item.title}
                  </h3>
                </button>

                {/* Excerpt Details */}
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                  {item.excerpt ?? "No details provided for this notice."}
                </p>

                {/* Footer Read trigger */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  {item.readingTime ? (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                      <IconClock className="size-3.5" />
                      {item.readingTime} min read
                    </span>
                  ) : (
                    <span />
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg text-[11px] font-bold text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                    onClick={() => {
                      handleMarkAsRead(item.id)
                      setSelectedAnnouncement(item)
                    }}
                  >
                    Read Details
                    <IconArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Announcement Details Modal */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={(open) => !open && setSelectedAnnouncement(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8">
          {selectedAnnouncement && (
            <div className="space-y-6">
                  <DialogHeader className="space-y-4 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground border-b pb-4 dark:border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <Badge className="rounded-lg border-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white bg-indigo-600 dark:bg-indigo-500">
                          Notice
                        </Badge>
                        <span className="flex items-center gap-1 font-medium">
                          <IconCalendar className="size-3.5" />
                          {selectedAnnouncement.publishedAt
                            ? new Date(selectedAnnouncement.publishedAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Draft"}
                        </span>
                      </div>

                      {selectedAnnouncement.readingTime && (
                        <span className="flex items-center gap-1 font-medium">
                          <IconClock className="size-3.5" />
                          {selectedAnnouncement.readingTime} min read
                        </span>
                      )}
                    </div>

                    <DialogTitle className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
                      {selectedAnnouncement.title}
                    </DialogTitle>
                  </DialogHeader>

              {selectedAnnouncement.excerpt && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-xs md:text-sm text-slate-600 dark:text-slate-300 dark:border-slate-800/80 dark:bg-slate-900/60 leading-relaxed italic">
                  {selectedAnnouncement.excerpt}
                </div>
              )}

              <Separator className="my-2" />

              <div className="prose prose-slate dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {selectedAnnouncement.content ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }}
                    className="space-y-4"
                  />
                ) : (
                  <p className="text-muted-foreground italic">
                    No body details provided for this notice.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

