"use client"

import { Button } from "@workspace/ui/components/button"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import Container from "../shared/container"

interface NewsItem {
  id: number
  title: string
  description: string
  author: string
  role: string
  date: string
}

export function NewsSection() {
  const t = useTranslations("home.news")
  const newsItems = t.raw("items") as NewsItem[]
  return (  
    <section className="bg-white py-20">
      <Container className="px-6">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-trajan text-2xl font-extrabold text-primary md:text-5xl">
            {t("title")}
          </h2>
          <Link href="/news">
            <Button className="rounded-md bg-primary px-6 text-white hover:bg-[#991b1b]">
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

              <div className="grow p-6">
                <h3 className="mb-3 cursor-pointer text-lg font-bold text-gray-900 underline transition-colors hover:text-[#8b0000]">
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

              <div className="px-6 pb-6">
                <Button className="w-full bg-primary py-5 text-white hover:bg-[#991b1b]">
                  {t("readMore")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
