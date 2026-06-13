"use client"

import React from "react"
import Image from "next/image"
import { Calendar, MapPin, Clock3 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import Container from "@/components/shared/container"

export default function UpcomingEvents() {
  const t = useTranslations("eventsPage")
  const mainEvent = t.raw("mainEvent")
  const subEvents = t.raw("subEvents")

  return (
    <section className="overflow-hidden bg-slate-50 py-20 md:py-24">
      <Container className="mx-auto px-5 lg:px-6">
        {/* HEADER */}
        <div className="mb-12 text-center">
          <span className="text-2xl font-semibold text-primary uppercase md:text-4xl">
            {t("sectionTitle")}
          </span>
        </div>

        {/* MAIN BANNER */}
        <div className="relative h-[420px] overflow-hidden rounded-3xl shadow-2xl md:h-[500px]">
          <Image
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600"
            alt={mainEvent.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          <div className="absolute bottom-0 p-6 text-white md:p-10">
            <h3 className="text-2xl font-bold md:text-4xl">
              {mainEvent.title}
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-200 md:flex-row md:gap-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {mainEvent.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock3 size={16} />
                {mainEvent.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                {mainEvent.location}
              </div>
            </div>
            <Button className="mt-6 bg-[#8B0000] hover:bg-[#6d0000]">
              {mainEvent.button}
            </Button>
          </div>
        </div>

        {/* SHADCN CAROUSEL */}
        <div className="relative mt-10">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {subEvents.map((event: any, index: number) => (
                <CarouselItem
                  key={index}
                  className="basis-full pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
                >
                  <div className="group h-full rounded-2xl border bg-white shadow-md transition hover:shadow-xl">
                    <div className="p-5">
                      <div className="h-1 w-full bg-gradient-to-r from-[#8B0000] to-red-500" />
                      <div className="mt-3 flex items-center gap-2 text-xs text-[#8B0000]">
                        <Calendar size={14} />
                        {event.date}
                      </div>
                      <h4 className="mt-2 text-lg font-bold group-hover:text-[#8B0000]">
                        {event.title}
                      </h4>
                      <p className="mt-3 text-sm text-gray-500">
                        {t("subEventDesc")}
                      </p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {t("viewDetails")}
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B0000]/10 transition group-hover:bg-[#8B0000]">
                          <MapPin className="h-4 w-4 text-[#8B0000] group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Container>
    </section>
  )
}
