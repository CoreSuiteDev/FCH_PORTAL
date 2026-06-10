"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel"
import Container from "@/components/shared/container"
import { Button } from "@workspace/ui/components/button"
import { slides } from "@/constents/slide-content"
import Link from "next/link"

export function HeroCarousel() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Sliding Carousel */}
      <Carousel
        // Add the opts prop to enable looping
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

      {/* Dark Overlay - Fixed */}
      <div className="absolute inset-0 z-10 bg-black/60 pointer-events-none" />

      {/* Fixed Content Container on top */}
      <div className="absolute inset-0 z-20 flex items-center justify-start px-12 pointer-events-none">
        <Container className="pointer-events-auto">
          {/* Content Container */}
          <div className="max-w-2xl text-left text-white">
            <h3 className="mb-4 font-montserrat text-sm font-medium tracking-[0.2em] uppercase">
              FEDERATION FOR CATECHESIS WITH HISPANICS
            </h3>
            <h1 className="mb-8 font-trajan text-3xl leading-tight md:text-5xl">
              TO SERVE THOSE WHO
              <br /> MINISTER IN CATECHESIS
              <br /> WITH HISPANICS.
            </h1>
            <p className="text-md mb-10 max-w-xl font-montserrat font-light md:text-lg">
              Empowering Catholic leaders, teachers, organizations, and
              groups through resource curation and community advocacy.
            </p>

            <div className="flex flex-col justify-start gap-4 md:flex-row">
              <Link href="/membership">
                <Button className="h-auto rounded-sm bg-[#e6a84d] px-8 py-3 font-montserrat font-semibold text-black hover:bg-[#d6983d]">
                  Become a Member
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="h-auto rounded-sm border-white bg-transparent px-8 py-3 font-montserrat font-semibold text-white hover:bg-white/10 hover:text-white"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}
