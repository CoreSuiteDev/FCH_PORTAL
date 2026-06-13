"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import Container from "@/components/shared/container"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"

export default function UpcomingWebinars() {
  const t = useTranslations("webinarsPage")
  const upcoming = t.raw("upcoming")
  const past = t.raw("past")
  const footer = t.raw("footer")

  return (
    <section className="bg-white py-24">
      <Container className="mx-auto px-6">
        {/* TOP SECTION */}
        <div className="mb-14 grid items-center gap-14 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#8B0000]">
              {upcoming.heading}
            </h2>
            <p className="leading-relaxed text-gray-600">{upcoming.text}</p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              {upcoming.features.map((f: string, i: number) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <Button className="bg-[#8B0000] hover:bg-[#6d0000]">
              {upcoming.button}
            </Button>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative h-[420px] overflow-hidden rounded-3xl shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
              alt="Webinar"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 p-8 text-white">
              <h3 className="text-2xl font-bold">{upcoming.bannerTitle}</h3>
              <p className="mt-2 text-sm text-white/80">
                {upcoming.bannerSubtitle}
              </p>
            </div>
          </motion.div>
        </div>

        {/* PAST WEBINARS */}
        <h2 className="mb-6 text-4xl font-bold text-[#8B0000]">
          {past.heading}
        </h2>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {past.items.map((item: any, index: number) => (
              <CarouselItem
                key={index}
                className="basis-full pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
              >
                <motion.div whileHover={{ y: -6 }}>
                  <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-md transition hover:shadow-2xl">
                    <div className="relative h-56">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 p-5 text-white">
                        <h3 className="text-lg font-bold">{item.title}</h3>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-gray-600">{footer.text}</p>
          <Button className="bg-[#8B0000] hover:bg-[#6d0000]">
            {footer.button}
          </Button>
        </div>
      </Container>
    </section>
  )
}
