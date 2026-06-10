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

interface SlideData {
  id: number
  src: string
}

export function HeroCarousel() {
  const slides: SlideData[] = [
    { id: 1, src: "/assets/slide1.jpg" },
    { id: 2, src: "/assets/slide2.jpg" },
    { id: 3, src: "/assets/slide3.jpg" },
  ]

  // Initialize Autoplay plugin with loop enabled
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <Carousel
      // Add the opts prop to enable looping
      opts={{
        loop: true,
      }}
      plugins={[plugin.current]}
      className="h-screen w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div
              className="relative flex h-screen w-full items-center justify-start bg-cover bg-center px-12 md:px-24"
              style={{ backgroundImage: `url(${slide.src})` }}
            >
              {/* Dark Overlay - Moved outside Container to ensure it covers full width */}
              <div className="absolute inset-0 bg-black/60" />

              <Container className="relative z-10">
                {/* Content Container */}
                <div className="max-w-2xl text-left text-white">
                  <h3 className="mb-4 font-montserrat text-sm font-medium tracking-[0.2em] uppercase">
                    FEDERATION FOR CATECHESIS WITH HISPANICS
                  </h3>
                  <h1 className="mb-8 font-trajan text-5xl leading-tight md:text-5xl">
                    TO SERVE THOSE WHO
                    <br /> MINISTER IN CATECHESIS
                    <br /> WITH HISPANICS.
                  </h1>
                  <p className="mb-10 max-w-xl font-montserrat text-lg font-light md:text-lg">
                    Empowering Catholic leaders, teachers, organizations, and
                    groups through resource curation and community advocacy.
                  </p>

                  <div className="flex justify-start gap-4">
                    <Button className="h-auto rounded-sm bg-[#e6a84d] px-8 py-3 font-montserrat font-semibold text-black hover:bg-[#d6983d]">
                      Become a Member
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto rounded-sm border-white bg-transparent px-8 py-3 font-montserrat font-semibold text-white hover:bg-white/10 hover:text-white"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </Container>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
