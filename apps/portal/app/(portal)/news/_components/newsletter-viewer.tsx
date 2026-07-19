"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Badge } from "@workspace/ui/components/badge"
import { IconFileText } from "@tabler/icons-react"
import { NewsItem } from "../page"

interface NewsletterViewerProps {
  item: NewsItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewsletterViewer({ item, open, onOpenChange }: NewsletterViewerProps) {
  if (!item) return null

  const isAnnouncement = item.newsType === "ANNOUNCEMENT"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[90vw] max-h-[85vh] flex flex-col p-6 rounded-2xl">
        <DialogHeader className="flex flex-row items-start gap-4 border-b pb-4 space-y-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IconFileText className="size-6" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant={isAnnouncement ? "default" : "outline"}
                className="text-[9px] font-extrabold uppercase tracking-wide"
              >
                {isAnnouncement ? "Announcement" : "News"}
              </Badge>
            </div>
            <DialogTitle className="text-lg font-bold leading-tight">
              {item.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {item.publishedAt
                ? `Published: ${new Date(item.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}`
                : "Unpublished"}
              {item.readingTime ? ` • ${item.readingTime} min read` : ""}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Content reader area */}
        <ScrollArea className="flex-1 mt-4 pr-3 overflow-y-auto max-h-[60vh]">
          {item.content ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ) : (
            <div className="space-y-4 text-sm text-foreground leading-relaxed">
              {item.excerpt && <p>{item.excerpt}</p>}
              <div className="rounded-xl bg-muted/50 p-6 text-center text-xs text-muted-foreground border border-dashed">
                <p>No content available for this article.</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
