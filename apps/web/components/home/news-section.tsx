"use client"
import React from "react"
import { newsData } from "@/constents/news-data"
import { Button } from "@workspace/ui/components/button"
import Image from "next/image"
import Container from "../shared/container"

export function NewsSection() {
  return (
    <section className="bg-white py-20">
      <Container className="px-6">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-trajan text-4xl font-bold text-[#8b0000]">
            LATEST NEWS
          </h2>
          <Button className="rounded-md bg-[#b91c1c] px-6 text-white hover:bg-[#991b1b]">
            More News
          </Button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {newsData.map((news) => (
            <div
              key={news.id}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="flex-grow p-6">
                <h3 className="mb-3 cursor-pointer text-lg font-bold text-gray-900 underline transition-colors hover:text-[#8b0000]">
                  {news.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {news.description}
                </p>

                {/* Meta Info */}
                <div className="mt-auto border-t pt-4 text-xs text-gray-500">
                  <p className="font-semibold text-gray-700">
                    By {news.author} | {news.role}
                  </p>
                  <p>{news.date}</p>
                </div>
              </div>

              <div className="px-6 pb-6">
                <Button className="w-full bg-[#b91c1c] text-white hover:bg-[#991b1b]">
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
