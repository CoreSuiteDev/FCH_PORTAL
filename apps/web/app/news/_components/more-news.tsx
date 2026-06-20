"use client"

import Container from "@/components/shared/container"
import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { newsData } from "@/constants/news-data"

const MoreNewsSection = () => {
  const t = useTranslations("newsPage")

  // ⭐ SAFE INDEX BASED FEATURED
  const featuredNews = newsData?.[0]
  const otherNews = newsData?.slice(1) ?? []

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
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* ⭐ FEATURED CARD (INDEX 0) */}
          {featuredNews && (
            <motion.a
              href={featuredNews.link}
              target="_blank"
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg md:col-span-2 md:row-span-2"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Image
                src={featuredNews.img}
                alt="featured news"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8">
                {/* CATEGORY */}
                <span className="text-sm font-bold tracking-widest text-amber-500 uppercase">
                  {t(featuredNews.categoryKey)}
                </span>

                {/* TITLE */}
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {t(featuredNews.titleKey)}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-2 text-sm text-gray-200">
                  {t(featuredNews.descKey)}
                </p>
              </div>
            </motion.a>
          )}

          {/* 🟡 OTHER NEWS */}
          {otherNews.map((item) => (
            <motion.a
              key={item.id}
              href={item.link}
              target="_blank"
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl"
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <Image
                src={item.img}
                alt="news image"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-6">
                {/* CATEGORY */}
                <span className="text-[10px] font-bold tracking-widest text-blue-300 uppercase">
                  {t(item.categoryKey)}
                </span>

                {/* TITLE */}
                <h3 className="mt-1 text-lg font-semibold text-white">
                  {t(item.titleKey)}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-1 line-clamp-2 text-xs text-gray-200">
                  {t(item.descKey)}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

export default MoreNewsSection
