"use client"

import React from "react"
import { Button } from "@workspace/ui/components/button"
import Image from "next/image"

import Link from "next/link"
import { useTranslations } from "next-intl"
import Container from "@/components/shared/container"

export function LatestNewsSection() {
  const t = useTranslations("home.news")
  const newsItems = t.raw("items") as any[]

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
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={`/assets/news${news.id}.jpg`}
                  alt={news.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="flex-grow p-6">
                <h3 className="mb-3 cursor-pointer text-lg font-bold text-gray-900 underline transition-colors hover:text-primary">
                  {news.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {news.description}
                </p>

                <div className="mt-auto border-t pt-4 text-xs text-gray-500">
                  <p className="font-semibold text-gray-700">
                    {t("meta.by")} {news.author} | {t("meta.role")}
                  </p>
                  <p>{news.date}</p>
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
