"use client"

import Container from "@/components/shared/container"
import { ZTCNewsOutput } from "@workspace/types"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"

interface MoreNewsSectionProps {
  newsItems?: ZTCNewsOutput[]
  isLoading?: boolean
}

const MoreNewsSection = ({ newsItems = [], isLoading }: MoreNewsSectionProps) => {
  const t = useTranslations("newsPage")

  // ⭐ SAFE INDEX BASED FEATURED
  const featuredNews = newsItems?.[0]
  const otherNews = newsItems?.slice(1) ?? []

  return (
    <section className="bg-slate-50 py-20">
      <Container className="mx-auto">
        {/* HEADER */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h2 className="font-trajan text-2xl font-bold text-primary md:text-5xl">
            {t("hero.title")}
          </h2>

          <p className="mt-2 text-gray-500 italic">{t("hero.description")}</p>
        </div>

        {/* GRID */}
        <motion.div
          className="grid auto-rows-[300px] grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <>
              {/* Featured Card Skeleton */}
              <div className="group relative overflow-hidden rounded-2xl bg-gray-200 animate-pulse md:col-span-2 md:row-span-2 p-8 flex flex-col justify-end space-y-3">
                <div className="h-4 w-20 rounded bg-gray-300" />
                <div className="h-8 w-3/4 rounded bg-gray-300" />
                <div className="h-4 w-1/2 rounded bg-gray-300" />
              </div>
              {/* Other Cards Skeletons */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl bg-gray-200 animate-pulse p-6 flex flex-col justify-end space-y-2">
                  <div className="h-3 w-16 rounded bg-gray-300" />
                  <div className="h-6 w-5/6 rounded bg-gray-300" />
                  <div className="h-3 w-2/3 rounded bg-gray-300" />
                </div>
              ))}
            </>
          ) : (
            <>
              {/* ⭐ FEATURED CARD (INDEX 0) */}
              {featuredNews && (
                <motion.div
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg md:col-span-2 md:row-span-2"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link href={`/news/${featuredNews.id}`}>
                    <Image
                      src={featuredNews.featuredImage || "/assets/feature-news.jpeg"}
                      alt={featuredNews.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/20 to-transparent p-8">
                      {/* CATEGORY */}
                      <span className="text-sm font-bold tracking-widest text-amber-500 uppercase">
                        {featuredNews.newsType}
                      </span>

                      {/* TITLE */}
                      <h3 className="mt-2 text-3xl font-bold text-white line-clamp-2">
                        {featuredNews.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="mt-2 text-sm text-gray-200 line-clamp-2">
                        {featuredNews.excerpt || featuredNews.content}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* 🟡 OTHER NEWS */}
              {otherNews.map((item) => (
                <motion.div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl"
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <Link href={`/news/${item.id}`}>
                    <Image
                      src={item.featuredImage || "https://picsum.photos/seed/news/800/600"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-6">
                      {/* CATEGORY */}
                      <span className="text-[10px] font-bold tracking-widest text-blue-300 uppercase">
                        {item.newsType}
                      </span>

                      {/* TITLE */}
                      <h3 className="mt-1 text-lg font-semibold text-white line-clamp-2">
                        {item.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="mt-1 line-clamp-2 text-xs text-gray-200">
                        {item.excerpt || item.content}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      </Container>
    </section>
  )
}

export default MoreNewsSection
