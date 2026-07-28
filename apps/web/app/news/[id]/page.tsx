"use client"

import { use, useEffect } from "react"
import { ReactLenis } from "@studio-freight/react-lenis"
import { useLocale } from "next-intl"
import Link from "next/link"
import Image from "next/image"
import { useNewsById, useIncrementViews } from "@/hooks/useNews"
import { ArrowLeft, Calendar, Eye, Clock, Share2, ChevronRight, User, Tag } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import Container from "@/components/shared/container"

export default function NewsDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const locale = useLocale()
  const isEs = locale === "es"

  const { data: news, isLoading, error } = useNewsById(id)
  const incrementViews = useIncrementViews()

  useEffect(() => {
    if (id) incrementViews.mutate(id)
  }, [id])

  if (error || (!isLoading && !news)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FBF9F8] p-6 text-center">
        <div className="mb-6 text-6xl">📰</div>
        <h2 className="font-trajan text-2xl font-extrabold text-primary">
          {isEs ? "Artículo no encontrado" : "Article Not Found"}
        </h2>
        <p className="mt-3 max-w-sm text-gray-500">
          {isEs ? "El artículo que buscas no existe o ha sido retirado." : "The article you are looking for does not exist or has been removed."}
        </p>
        <Link href="/news" className="mt-8">
          <Button className="rounded-full bg-primary px-6 text-white hover:bg-primary/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isEs ? "Volver a Noticias" : "Back to News"}
          </Button>
        </Link>
      </div>
    )
  }

  const handleShare = () => {
    if (!news) return
    if (navigator.share) {
      navigator.share({ title: news.title, text: news.excerpt || undefined, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert(isEs ? "¡Enlace copiado al portapapeles!" : "Link copied to clipboard!")
    }
  }

  const formattedDate = news?.publishedAt
    ? new Date(news.publishedAt).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })
    : news?.createdAt
      ? new Date(news.createdAt).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })
      : ""

  const newsTypeLabel: Record<string, string> = {
    NEWS: isEs ? "Noticia" : "News",
    BLOG: "Blog",
    ANNOUNCEMENT: isEs ? "Anuncio" : "Announcement",
  }

  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.2, smoothWheel: true, syncTouch: true, wheelMultiplier: 2.0 }}>
      <div className="fixed inset-0 -z-10 bg-[#FBF9F8]" />

      <main className="relative pb-24 pt-20">
        <Container className="max-w-3xl">

          {/* ── Breadcrumb ── */}
          <nav className="mb-8 flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="transition-colors hover:text-primary">{isEs ? "Inicio" : "Home"}</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/news" className="transition-colors hover:text-primary">{isEs ? "Noticias" : "News"}</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="max-w-[200px] truncate font-medium text-gray-600">
              {isLoading ? "..." : news?.title}
            </span>
          </nav>

          {isLoading ? (
            /* ── Skeleton ── */
            <div className="animate-pulse space-y-6">
              <div className="h-3 w-24 rounded-full bg-gray-200" />
              <div className="space-y-3">
                <div className="h-10 w-full rounded bg-gray-200" />
                <div className="h-10 w-4/5 rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-1.5">
                  <div className="h-3 w-28 rounded bg-gray-200" />
                  <div className="h-3 w-20 rounded bg-gray-200" />
                </div>
              </div>
              <div className="aspect-[3/2] w-full rounded-xl bg-gray-200" />
              <div className="space-y-2.5">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-4 rounded bg-gray-200" style={{ width: `${70 + (i % 4) * 8}%` }} />
                ))}
              </div>
            </div>
          ) : news && (
            <article>

              {/* ── Category Badge ── */}
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-block rounded-sm bg-primary px-2.5 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-widest text-white">
                  {news.supTitle || newsTypeLabel[news.newsType] || news.newsType}
                </span>
              </div>

              {/* ── Title ── */}
              <h1 className="mb-4 font-trajan text-2xl font-extrabold leading-snug text-gray-900 md:text-3xl lg:text-4xl">
                {news.title}
              </h1>

              {/* ── Deck / Excerpt ── */}
              {news.excerpt && (
                <p className="mb-6 text-base font-medium leading-relaxed text-gray-500 md:text-lg">
                  {news.excerpt}
                </p>
              )}

              {/* ── Author + Meta row ── */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-gray-200 py-4">
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-primary/10">
                    {news.author?.avatar ? (
                      <Image src={news.author.avatar} alt={news.author.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {news.author?.name || "FCH Editorial Team"}
                    </p>
                    {news.author?.designation && (
                      <p className="text-xs text-primary">
                        {news.author.designation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Article meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {news.viewCount} {isEs ? "vistas" : "views"}
                  </span>
                  {news.readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {news.readingTime} {isEs ? "min" : "min read"}
                    </span>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:border-primary hover:text-primary"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    {isEs ? "Compartir" : "Share"}
                  </button>
                </div>
              </div>

              {/* ── Featured Image ── */}
              <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm">
                <Image
                  src={news.featuredImage || "/assets/feature-news.jpeg"}
                  alt={news.featuredImageAlt || news.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              {news.featuredImageAlt && (
                <p className="mb-8 -mt-5 text-center text-xs italic text-gray-400">
                  {news.featuredImageAlt}
                </p>
              )}

              {/* ── Article Body ── */}
              <div className="prose prose-base max-w-none whitespace-pre-line leading-[1.85] text-gray-700
                prose-headings:font-trajan prose-headings:font-extrabold prose-headings:text-gray-900
                prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                prose-p:mb-5
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:pl-4 prose-blockquote:text-gray-600 prose-blockquote:not-italic
              ">
                {news.content}
              </div>

              {/* ── Tags ── */}
              {news.tags && news.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-6">
                  <Tag className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  {news.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="cursor-default rounded-full border border-gray-200 bg-white px-3 py-1 font-montserrat text-[11px] font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:border-primary hover:text-primary"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* ── Author Bio Card ── */}
              {news.author && (
                <div className="mt-10 flex gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-primary/10">
                    {news.author.avatar ? (
                      <Image src={news.author.avatar} alt={news.author.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-7 w-7 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-montserrat text-[10px] font-bold uppercase tracking-widest text-primary">
                      {isEs ? "Sobre el autor" : "About the Author"}
                    </p>
                    <h3 className="mt-0.5 text-base font-bold text-gray-900">
                      {news.author.name}
                    </h3>
                    {news.author.designation && (
                      <p className="text-xs font-medium text-gray-500">{news.author.designation}</p>
                    )}
                    {news.author.bio && (
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{news.author.bio}</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Back to News ── */}
              <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {isEs ? "Volver a todas las noticias" : "Back to all news"}
                </Link>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 transition-all hover:border-primary hover:text-primary"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {isEs ? "Compartir artículo" : "Share article"}
                </button>
              </div>

            </article>
          )}
        </Container>
      </main>
    </ReactLenis>
  )
}
