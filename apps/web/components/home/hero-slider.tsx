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

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/60" />

      {/* Hero content overlay */}
      {/* Added flex items-center to center vertically, and ml-0 to force left alignment */}
      <div className="pointer-events-none absolute inset-0 z-20 flex h-full items-center">
        <Container className="pointer-events-auto w-full">
          {/* By setting w-full and ensuring no auto-margins, content will respect left alignment */}
          <div className="flex w-full justify-start">
            <div className="max-w-2xl text-left text-white">
              <h3 className="mb-4 font-montserrat text-sm font-medium tracking-[0.2em] uppercase">
                {t("hero.label")}
              </h3>

              <h1 className="mb-8 font-trajan text-3xl leading-tight font-bold whitespace-pre-line md:text-5xl">
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
        </Container>
      </div>
    </div>
  )
}
