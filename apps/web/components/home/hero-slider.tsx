"use client"
import * as React from "react"
import { useTranslations } from "next-intl"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel"
import Container from "@/components/shared/container"
import { Button } from "@workspace/ui/components/button"
import { slides } from "@/constants/slide-content"
import Link from "next/link"

export function HeroCarousel() {
  // Accessing the 'home' namespace
  const t = useTranslations("home")

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Carousel */}
      <Carousel
        opts={{
          loop: true,
          align: "center",
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="h-full w-full"
      >
        <CarouselContent className="h-full">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full">
              <div
                className="h-screen w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.src})` }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dark overlay for better text readability */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/60" />

      {/* Hero content overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 mx-auto flex max-w-7xl items-center justify-start px-4">
        <div className="pointer-events-auto">
          <div className="max-w-2xl text-left text-white">
            {/* Accessing data via hero object */}
            <h3 className="mb-4 font-montserrat text-sm font-medium tracking-[0.2em] uppercase">
              {t("hero.label")}
            </h3>
            <h1 className="landing-titgh mb-8 font-trajan text-3xl font-semibold whitespace-pre-line uppercase md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="text-md mb-10 max-w-xl font-montserrat font-light md:text-lg">
              {t("hero.description")}
            </p>

            <div className="flex flex-col justify-start gap-4 md:flex-row">
              <Link href="/membership">
                <Button className="h-auto rounded-sm bg-[#e6a84d] px-8 py-3 font-montserrat font-semibold text-black hover:bg-[#d6983d]">
                  {t("hero.buttons.membership")}
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="h-auto rounded-sm border-white bg-transparent px-8 py-3 font-montserrat font-semibold text-white hover:bg-white/10 hover:text-white"
                >
                  {t("hero.buttons.learnMore")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
