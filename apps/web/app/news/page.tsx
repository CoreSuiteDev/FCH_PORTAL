"use client"

import { ReactLenis } from "@studio-freight/react-lenis"
import { useTranslations } from "next-intl"
import { useNewsList } from "@/hooks/useNews"

import DynamicHero from "@/components/shared/dynamic-hero"
import { LatestNewsSection } from "./_components/latest-news"
import MoreNewsSection from "./_components/more-news"

export default function NewsPage() {
  const t = useTranslations("newsPage.hero")
  const { data: newsRes, isLoading, error } = useNewsList({ status: "PUBLISHED" })

  const newsItems = newsRes?.data || []
  const latestNews = newsItems.slice(0, 3)
  const moreNews = newsItems.slice(3)

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
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10 bg-[url('/assets/about-baner.jpg')] bg-cover bg-center bg-no-repeat" />

      <main className="relative">
        <DynamicHero>
          <div className="relative z-10">
            <h2 className="mb-4 font-trajan text-4xl font-bold whitespace-pre-line text-white md:text-5xl">
              {t("title")}
            </h2>

            <p className="md:text-md mb-8 max-w-2xl text-white">
              {t("description")}
            </p>
          </div>
        </DynamicHero>

        {error ? (
          <div className="flex h-96 flex-col items-center justify-center bg-white p-6 text-center">
            <p className="text-lg font-semibold text-red-500">Failed to load news articles</p>
            <p className="text-sm text-gray-500">Please check your connection and try again.</p>
          </div>
        ) : !isLoading && newsItems.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center bg-white p-6 text-center">
            <p className="text-lg font-semibold text-gray-600">No news articles found</p>
            <p className="text-sm text-gray-400">Check back later for updates.</p>
          </div>
        ) : (
          <>
            {(isLoading || latestNews.length > 0) && (
              <LatestNewsSection newsItems={latestNews} isLoading={isLoading} />
            )}
            {(isLoading || moreNews.length > 0) && (
              <MoreNewsSection newsItems={moreNews} isLoading={isLoading} />
            )}
          </>
        )}
      </main>
    </ReactLenis>
  )
}
