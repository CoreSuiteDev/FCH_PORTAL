"use client"

import React from "react"
import { Button } from "@workspace/ui/components/button"
import Image from "next/image"

import Link from "next/link"
import { useTranslations } from "next-intl"
import Container from "@/components/shared/container"
import { ZTCNewsOutput } from "@workspace/types"

interface LatestNewsSectionProps {
  newsItems?: ZTCNewsOutput[]
  isLoading?: boolean
}

export function LatestNewsSection({ newsItems = [], isLoading }: LatestNewsSectionProps) {
  const t = useTranslations("home.news")

  return (
    <section className="bg-white py-20">
      <Container className="">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-trajan text-2xl font-bold text-primary md:text-4xl">
            {t("title")}
          </h2>
          <Link href="/news">
            <Button className="rounded-md bg-[#b91c1c] px-6 text-white hover:bg-[#991b1b]">
              {t("button")}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col overflow-hidden rounded-xl border border-gray-200 p-6 space-y-4 animate-pulse"
                >
                  <div className="relative h-52 w-full rounded-lg bg-gray-200" />
                  <div className="h-6 w-3/4 rounded bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-5/6 rounded bg-gray-200" />
                  </div>
                  <div className="mt-auto border-t pt-4 flex justify-between">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="h-4 w-16 rounded bg-gray-200" />
                  </div>
                </div>
              ))
            : newsItems.map((news) => (
                <div
                  key={news.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div className="relative h-56 w-full bg-slate-100">
                    <Image
                      src={news.featuredImage || `/assets/news1.jpg`}
                      alt={news.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <div className="flex flex-col flex-grow p-6">
                    <Link href={`/news/${news.id}`}>
                      <h3 className="mb-3 cursor-pointer text-lg font-bold text-gray-900 underline transition-colors hover:text-primary line-clamp-2 min-h-[3.5rem]">
                        {news.title}
                      </h3>
                    </Link>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
                      {news.excerpt || news.content}
                    </p>

                    <div className="mt-auto border-t pt-4 text-xs text-gray-500">
                      <p className="font-semibold text-gray-700">
                        {t("meta.by")} {news.author?.name || "FCH Team"} | {news.author?.designation || "Contributor"}
                      </p>
                      <p>{news.publishedAt ? new Date(news.publishedAt).toLocaleDateString() : new Date(news.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Link href={`/news/${news.id}`}>
                    <Button className="w-full bg-[#b91c1c] py-5 text-white hover:bg-[#991b1b]">
                      {t("readMore")}
                    </Button>
                  </Link>
                </div>
              ))}
        </div>
      </Container>
    </section>
  )
}
