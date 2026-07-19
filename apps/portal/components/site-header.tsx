"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  IconBell,
  IconCalendar,
  IconClock,
  IconArrowRight,
  IconInbox,
} from "@tabler/icons-react"
import { useNewsList } from "@/hooks/useNews"

export function SiteHeader() {
  const pathname = usePathname()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<string[]>([])
  const [detailAnnouncement, setDetailAnnouncement] = useState<any | null>(null)

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

  // Extract route name from pathname and format it
  const segments = pathname.split("/").filter(Boolean)
  const currentPage = segments[segments.length - 1] || "Home"
  const formattedPage =
    currentPage.charAt(0).toUpperCase() + currentPage.slice(1)

  // Fetch 5 latest published announcements
  const { data: newsData } = useNewsList({
    page: 1,
    limit: 5,
    status: "PUBLISHED",
    newsType: "ANNOUNCEMENT",
  })

  const announcements = newsData?.data ?? []
  const unreadCount = announcements.filter(
    (item) => !readAnnouncementIds.includes(item.id)
  ).length

  const handleMarkAsRead = (id: string) => {
    if (!readAnnouncementIds.includes(id)) {
      const updated = [...readAnnouncementIds, id]
      setReadAnnouncementIds(updated)
      localStorage.setItem("fch_read_announcements", JSON.stringify(updated))
    }
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-base font-medium">
                {formattedPage}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          {/* Announcements Notification Popover */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Announcements notifications"
              >
                <IconBell className="size-5 text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white shadow-sm dark:bg-indigo-500">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96 p-4 flex flex-col overflow-hidden bg-card border border-slate-205 dark:border-slate-800/80 shadow-md rounded-xl" align="end">
              <div className="flex items-center justify-between pb-3 border-b mb-3 dark:border-slate-800/80">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-50">
                  Diocese Announcements
                </h4>
                {unreadCount > 0 && (
                  <Badge className="bg-indigo-100 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-none font-extrabold text-[9px] px-1.5 py-0.5">
                    {unreadCount} New
                  </Badge>
                )}
              </div>

              <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2.5 pr-1">
                {announcements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-400 dark:bg-slate-900/50">
                      <IconInbox className="size-4" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">No announcements yet</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500">You will be updated on new diocese alerts.</p>
                  </div>
                ) : (
                  announcements.map((item) => {
                    const isRead = readAnnouncementIds.includes(item.id)
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          handleMarkAsRead(item.id)
                          setIsPopoverOpen(false)
                          setDetailAnnouncement(item)
                        }}
                        className={`group relative rounded-xl border p-3 transition-all duration-200 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 cursor-pointer ${
                          !isRead
                            ? "border-l-4 border-l-indigo-600 dark:border-l-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10"
                            : "border-slate-100 dark:border-slate-800/80"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 leading-snug">
                            {item.title}
                          </h5>
                          {!isRead && (
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                          {item.excerpt || "Click to see details."}
                        </p>
                        <div className="flex items-center justify-between mt-2 text-[9px] text-muted-foreground font-medium">
                          <span>
                            {item.publishedAt
                              ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Draft"}
                          </span>
                          {item.readingTime && (
                            <span>{item.readingTime} min read</span>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="pt-3 border-t mt-3 flex items-center justify-center dark:border-slate-800/80">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-xl text-[11px] font-bold gap-1 h-8 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                  onClick={() => setIsPopoverOpen(false)}
                >
                  <Link href="/announcements">
                    View All Announcements
                    <IconArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Announcement Detail Modal */}
          <Dialog open={!!detailAnnouncement} onOpenChange={(open) => !open && setDetailAnnouncement(null)}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8">
              {detailAnnouncement && (
                <div className="space-y-6">
                  <DialogHeader className="space-y-4 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground border-b pb-4 dark:border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <Badge className="rounded-lg border-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white bg-indigo-600 dark:bg-indigo-500">
                          Notice
                        </Badge>
                        <span className="flex items-center gap-1 font-medium">
                          <IconCalendar className="size-3.5" />
                          {detailAnnouncement.publishedAt
                            ? new Date(detailAnnouncement.publishedAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Draft"}
                        </span>
                      </div>

                      {detailAnnouncement.readingTime && (
                        <span className="flex items-center gap-1 font-medium">
                          <IconClock className="size-3.5" />
                          {detailAnnouncement.readingTime} min read
                        </span>
                      )}
                    </div>

                    <DialogTitle className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
                      {detailAnnouncement.title}
                    </DialogTitle>
                  </DialogHeader>

                  {detailAnnouncement.excerpt && (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-xs md:text-sm text-slate-600 dark:text-slate-355 dark:border-slate-800/80 dark:bg-slate-900/60 leading-relaxed italic">
                      {detailAnnouncement.excerpt}
                    </div>
                  )}

                  <Separator className="my-2" />

                  <div className="prose prose-slate dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                    {detailAnnouncement.content ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: detailAnnouncement.content }}
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
      </div>
    </header>
  )
}

