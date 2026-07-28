"use client"

import { useNewsBySlug, useNewsList } from "@/hooks/useNews"
import {
  IconArrowLeft,
  IconBook,
  IconCalendar,
  IconChevronRight,
  IconClock,
  IconUser,
} from "@tabler/icons-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function NewsDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  // Fetch current article
  const { data: article, isLoading, isError } = useNewsBySlug(slug)

  // Fetch recent news for sidebar/related section
  const { data: recentNewsData } = useNewsList({
    page: 1,
    limit: 4,
    status: "PUBLISHED",
  })

  const recentArticles = (recentNewsData?.data ?? []).filter(
    (item) => item.slug !== slug
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex-1 bg-slate-50/50 p-8 pt-6 dark:bg-slate-900/40">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Title & Metadata Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Featured Image Skeleton */}
          <Skeleton className="aspect-video w-full rounded-2xl" />

          {/* Content Paragraph Skeletons */}
          <div className="space-y-4 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-slate-50/50 p-8 text-center dark:bg-slate-900/40">
        <div className="max-w-md space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <IconBook className="size-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Article Not Found
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The news article you are trying to view does not exist or has been
            unpublished.
          </p>
          <Button
            asChild
            className="cursor-pointer rounded-xl text-xs font-bold"
          >
            <Link href="/news">Back to News Archive</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isAnnouncement = article.newsType === "ANNOUNCEMENT"

  return (
    <div className="min-h-screen flex-1 bg-slate-50/50 p-8 pt-6 dark:bg-slate-900/40">
      <div className="mx-auto max-w-6xl">
        {/* Navigation Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link
            href="/news"
            className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            News & Publications
          </Link>
          <IconChevronRight className="size-3.5 text-muted-foreground/60" />
          <span className="max-w-xs truncate font-semibold text-foreground md:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* Back Button */}
        <Button
          onClick={() => router.push("/news")}
          variant="ghost"
          size="sm"
          className="mb-6 cursor-pointer gap-2 rounded-xl text-xs font-bold transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <IconArrowLeft className="size-4" /> Back to list
        </Button>

        {/* Two-column Layout for Article & Sidebar */}
        <div className="grid items-start gap-10 lg:grid-cols-12">
          {/* Main Article Content */}
          <article className="space-y-8 rounded-2xl border border-slate-200/60 bg-card p-6 shadow-xs md:p-10 lg:col-span-8 dark:border-slate-800/40">
            {/* Badges and metadata header */}
            <div className="space-y-4">
              <Badge
                className={`rounded-lg border-0 px-3 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-sm ${
                  isAnnouncement
                    ? "bg-amber-500"
                    : "bg-indigo-600 dark:bg-indigo-500"
                }`}
              >
                {isAnnouncement ? "Announcement" : "News"}
              </Badge>

              <h1 className="text-2xl leading-tight font-extrabold text-slate-900 md:text-3xl dark:text-slate-50">
                {article.title}
              </h1>

              {/* Author & Meta details bar */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-slate-100 py-4 text-xs font-medium text-muted-foreground dark:border-slate-800/80">
                {/* Author Info */}
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <IconUser className="size-4" />
                  </div>
                  <span>{article.author?.name || "FCH Editorial"}</span>
                </div>

                {/* Published Date */}
                <span className="flex items-center gap-1.5">
                  <IconCalendar className="size-4 text-muted-foreground/80" />
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : "—"}
                </span>

                {/* Reading Time */}
                {article.readingTime && (
                  <span className="flex items-center gap-1.5">
                    <IconClock className="size-4 text-muted-foreground/80" />
                    {article.readingTime} min read
                  </span>
                )}
              </div>
            </div>

            {/* Featured Cover Image */}
            <div className="relative aspect-video max-h-[420px] w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40">
              {article.featuredImage ? (
                <Image
                  src={article.featuredImage}
                  alt={article.featuredImageAlt || article.title}
                  fill
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/10 dark:to-pink-500/20">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-sky-400/5 via-transparent to-transparent" />
                  <IconBook className="size-16 text-indigo-500/30 dark:text-indigo-400/30" />
                </div>
              )}
            </div>

            {/* Excerpt/Intro summary block if exists */}
            {article.excerpt && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 italic dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300">
                {article.excerpt}
              </div>
            )}

            {/* Content Body Container */}
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-800 md:text-base dark:text-slate-200">
              {article.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: article.content }}
                  className="space-y-4"
                />
              ) : (
                <p className="text-muted-foreground italic">
                  No article body content available.
                </p>
              )}
            </div>
          </article>

          {/* Right Sidebar: Related & Recent Publications */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200/60 bg-card p-6 shadow-xs dark:border-slate-800/40">
              <h3 className="mb-4 border-b pb-2 text-sm font-bold tracking-wider text-foreground uppercase">
                Recent Publications
              </h3>

              {recentArticles.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No other publications found.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentArticles.map((item) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.slug}`}
                      className="group block space-y-1.5 border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0 text-[8px] font-bold tracking-wide uppercase"
                      >
                        {item.newsType === "ANNOUNCEMENT"
                          ? "Announcement"
                          : "News"}
                      </Badge>
                      <h4 className="line-clamp-2 text-xs font-bold text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "—"}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
