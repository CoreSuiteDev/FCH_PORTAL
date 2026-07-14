"use client"

import { use, useEffect } from "react"
import { ReactLenis } from "@studio-freight/react-lenis"
import { useLocale } from "next-intl"
import Link from "next/link"
import Image from "next/image"
import { useNewsById, useIncrementViews } from "@/hooks/useNews"
import { Loader2, ArrowLeft, Calendar, Eye, Clock, Share2, User, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import Container from "@/components/shared/container"

export default function NewsDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const locale = useLocale()
  const isEs = locale === "es"

  const { data: news, isLoading, error } = useNewsById(id)
  const incrementViews = useIncrementViews()

  useEffect(() => {
    if (id) {
      incrementViews.mutate(id)
    }
  }, [id])

  if (error || (!isLoading && !news)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500">
          {isEs ? "Artículo no encontrado" : "Article not found"}
        </h2>
        <p className="mt-2 text-gray-500">
          {isEs ? "El artículo que buscas no existe o ha sido retirado." : "The article you are looking for does not exist or has been removed."}
        </p>
        <Link href="/news" className="mt-6">
          <Button className="bg-[#b91c1c] text-white hover:bg-[#991b1b]">
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
      navigator.share({
        title: news.title,
        text: news.excerpt || undefined,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert(isEs ? "¡Enlace copiado al portapapeles!" : "Link copied to clipboard!")
    }
  }

  const formattedDate = news?.publishedAt
    ? new Date(news.publishedAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : news?.createdAt
      ? new Date(news.createdAt).toLocaleDateString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : ""

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        wheelMultiplier: 2.0,
      }}
    >
      <div className="fixed inset-0 -z-10 bg-slate-50" />

      <main className="relative pt-24 pb-20">
        <Container className="max-w-5xl">
          {/* Breadcrumb / Back button */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/news"
              className="inline-flex items-center text-sm font-semibold text-gray-600 transition-colors hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isEs ? "Volver a Noticias" : "Back to News"}
            </Link>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Link href="/" className="hover:text-primary">{isEs ? "Inicio" : "Home"}</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/news" className="hover:text-primary">{isEs ? "Noticias" : "News"}</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="truncate max-w-[200px] text-gray-600 font-medium">
                {isLoading ? (isEs ? "Cargando..." : "Loading...") : news?.title}
              </span>
            </div>
          </div>

          <article className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Main content column */}
            <div className="lg:col-span-2 space-y-6">
              {isLoading ? (
                <div className="space-y-6 animate-pulse">
                  {/* Title Skeleton */}
                  <div className="space-y-3">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="h-10 w-full rounded bg-gray-200" />
                    <div className="h-10 w-2/3 rounded bg-gray-200" />
                    <div className="h-6 w-1/2 rounded bg-gray-200" />
                  </div>
                  {/* Featured Image Skeleton */}
                  <div className="relative aspect-video w-full rounded-2xl bg-gray-200" />
                  {/* Excerpt Skeleton */}
                  <div className="h-16 w-full rounded bg-gray-200 border-l-4 border-gray-300" />
                  {/* Body Content Skeletons */}
                  <div className="space-y-3">
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-5/6 rounded bg-gray-200" />
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-4/5 rounded bg-gray-200" />
                  </div>
                </div>
              ) : news && (
                <>
                  {/* Header section */}
                  <div className="space-y-4">
                    {news.supTitle && (
                      <span className="inline-block rounded bg-red-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                        {news.supTitle}
                      </span>
                    )}
                    <h1 className="font-trajan text-3xl font-extrabold text-gray-900 leading-tight md:text-4xl lg:text-5xl">
                      {news.title}
                    </h1>
                    
                    {/* Meta stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-y border-gray-100 py-3">
                      <div className="flex items-center">
                        <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                        {formattedDate}
                      </div>
                      <div className="flex items-center">
                        <Eye className="mr-1.5 h-4 w-4 text-gray-400" />
                        {news.viewCount} {isEs ? "Vistas" : "Views"}
                      </div>
                      {news.readingTime && (
                        <div className="flex items-center">
                          <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                          {news.readingTime} {isEs ? "min de lectura" : "min read"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                    <Image
                      src={news.featuredImage || "/assets/feature-news.jpeg"}
                      alt={news.featuredImageAlt || news.title}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>

                  {/* Excerpt block */}
                  {news.excerpt && (
                    <div className="border-l-4 border-primary pl-4 py-1 italic text-lg text-gray-700 font-medium">
                      {news.excerpt}
                    </div>
                  )}

                  {/* Main Content Body */}
                  <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-4 whitespace-pre-line">
                    {news.content}
                  </div>

                  {/* Tags & Share */}
                  <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {news.tags?.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-slate-200 transition-colors cursor-default"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>

                    <Button
                      onClick={handleShare}
                      variant="outline"
                      size="sm"
                      className="rounded-full border-gray-300 text-gray-600 hover:text-primary hover:border-primary transition-all"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      {isEs ? "Compartir" : "Share"}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar Column (Author details & Info) */}
            <div className="space-y-6 lg:col-span-1">
              <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
                {isLoading ? (
                  <div className="space-y-6 animate-pulse">
                    <div className="space-y-3">
                      <div className="h-3 w-20 rounded bg-gray-200" />
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gray-200" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-24 rounded bg-gray-200" />
                          <div className="h-3 w-16 rounded bg-gray-200" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 border-t pt-4">
                      <div className="h-3 w-full rounded bg-gray-200" />
                      <div className="h-3 w-5/6 rounded bg-gray-200" />
                    </div>
                  </div>
                ) : news && (
                  <>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                        {isEs ? "Sobre el autor" : "About the Author"}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-100 border-2 border-primary/10">
                          {news.author?.avatar ? (
                            <Image
                              src={news.author.avatar}
                              alt={news.author.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-gray-400">
                              <User className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {news.author?.name || "FCH Team"}
                          </h4>
                          <p className="text-xs text-primary font-semibold">
                            {news.author?.designation || "Contributor"}
                          </p>
                        </div>
                      </div>

                      {news.author?.bio && (
                        <p className="mt-4 text-sm text-gray-600 leading-relaxed italic border-t pt-4 border-gray-100">
                          "{news.author.bio}"
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-6 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        {isEs ? "Detalles de publicación" : "Publication Info"}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-400 block">{isEs ? "Tipo:" : "Type:"}</span>
                          <span className="font-semibold text-gray-700 capitalize">{news.newsType.toLowerCase()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">{isEs ? "Estado:" : "Status:"}</span>
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 font-bold text-green-700 uppercase tracking-widest text-[9px] border border-green-200">
                            {news.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </article>
        </Container>
      </main>
    </ReactLenis>
  )
}
