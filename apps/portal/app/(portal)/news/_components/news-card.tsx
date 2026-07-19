"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { IconClock, IconCalendar, IconArrowRight, IconBook } from "@tabler/icons-react"
import { NewsItem } from "../page"
import Image from "next/image"

interface NewsCardProps {
  item: NewsItem
}

export function NewsCard({ item }: NewsCardProps) {
  const isDraft = item.status === "DRAFT"
  const isAnnouncement = item.newsType === "ANNOUNCEMENT"

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] dark:border-slate-800/85 dark:bg-slate-900/60 dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)]">
      
      {/* Visual Cover Image */}
      <Link href={`/news/${item.slug}`} className="block relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800/50">
        {item.featuredImage ? (
          <Image
            src={item.featuredImage}
            alt={item.featuredImageAlt || item.title}
            fill
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Abstract premium gradient background if no image is uploaded */
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/10 dark:to-pink-500/20 animate-pulse">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent" />
            <IconBook className="size-10 text-indigo-500/60 dark:text-indigo-400/50 transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}

        {/* Absolute Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          <Badge
            className={`rounded-lg border-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
              isAnnouncement
                ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
                : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            }`}
          >
            {isAnnouncement ? "Announcement" : "News"}
          </Badge>
          {isDraft && (
            <Badge variant="destructive" className="rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Draft
            </Badge>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <CardContent className="flex flex-1 flex-col p-6">
        {/* Date and Reading Time */}
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground mb-3 font-medium">
          <span className="flex items-center gap-1.5">
            <IconCalendar className="size-3.5" />
            {item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Draft"}
          </span>
          {item.readingTime && (
            <span className="flex items-center gap-1.5">
              <IconClock className="size-3.5" />
              {item.readingTime} min read
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/news/${item.slug}`} className="block">
          <h4 className="line-clamp-2 text-base font-bold text-slate-800 dark:text-slate-100 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 leading-snug">
            {item.title}
          </h4>
        </Link>

        {/* Excerpt Summary */}
        <p className="line-clamp-3 text-xs text-muted-foreground leading-relaxed mt-3">
          {item.excerpt ?? "No description or summary provided for this article."}
        </p>

        {/* Spacer to push button to the bottom */}
        <div className="flex-1 min-h-[20px]" />

        {/* Read Article Action Trigger */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mt-4 w-full justify-between rounded-xl border border-slate-200/60 bg-slate-50/50 hover:bg-indigo-50/50 hover:text-indigo-600 hover:border-indigo-200/50 dark:border-slate-800/40 dark:bg-slate-900/30 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400 dark:hover:border-indigo-900/40 font-bold text-xs group/btn cursor-pointer transition-all duration-300 py-5"
        >
          <Link href={`/news/${item.slug}`}>
            <span>Read Full Article</span>
            <IconArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
