"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import Container from "@/components/shared/container"
import { Calendar, MapPin, Users } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import { Webinar } from "../[slug]/page"

export default function UpcomingWebinars() {
  const t = useTranslations("webinarsPage")
  const upcoming = t.raw("upcoming")
  const past = t.raw("past")
  const footer = t.raw("footer")

  const [featured, ...restItems] = upcoming.items

  return (
    <section className="bg-white py-16">
      <Container>
        <h2 className="mb-10 font-trajan text-2xl font-extrabold text-primary md:text-4xl">
          {upcoming.heading}
        </h2>

        {/* FEATURED BANNER SECTION */}
        {featured && (
          <div className="relative mb-12 h-[400px] w-full overflow-hidden rounded-3xl">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 p-8 text-white">
              <h1 className="font-trajan text-4xl font-bold uppercase">
                {featured.title}
              </h1>
              <p className="mt-2 text-white/90">{featured.description}</p>
              <Link href={`/webinars/${featured.id}`}>
                <Button className="mt-4 bg-primary px-5 py-5 font-semibold text-white hover:bg-gray-200">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* UPCOMING GRID SECTION */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {restItems.map((item: Webinar, index: number) => (
            <Card
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-100 p-0 shadow-sm"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-4 font-trajan text-lg font-bold">
                  {item.title}
                </h3>
                <div className="mb-6 space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> {item.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {item.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Capacity: {item.capacity}
                  </p>
                </div>
                <Link href={`/webinars/${item.id}`}>
                  <Button
                    variant="outline"
                    className="w-full border-red-800 text-red-800 hover:bg-red-800 hover:text-white"
                  >
                    {upcoming.viewDetails}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* VIEW MORE BUTTON (UPCOMING এর নিচে যোগ করা হয়েছে) */}
        <div className="mt-10 flex justify-center">
          <Link href="/membership">
            <Button className="bg-primary px-10 py-6 text-lg text-white hover:opacity-90">
              View More
            </Button>
          </Link>
        </div>

        {/* PAST WEBINARS CAROUSEL */}
        <h2 className="mr-10 mb-8 font-trajan text-2xl font-bold text-primary md:mt-16 md:text-4xl">
          {past.heading}
        </h2>
        <Carousel className="w-full">
          <CarouselContent>
            {past.items.map((item: any, index: number) => (
              <CarouselItem key={index} className="md:basis-1/3">
                <Card className="relative h-56 overflow-hidden rounded-2xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-5 left-5 font-bold text-white">
                    {item.title}
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* FOOTER CTA */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-gray-600">{footer.text}</p>
          <Link href="/membership">
            <Button className="bg-primary">{footer.button}</Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
