"use client"

import * as React from "react"
import Container from "@/components/shared/container"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import Image from "next/image"
import { useTranslations } from "next-intl"
import Autoplay from "embla-carousel-autoplay"

interface Testimonial {
  id: string
  text: string
  name: string
  role: string
}

export function TestimonialSection() {
  const t = useTranslations("home.testimonials")
  const testimonials: Testimonial[] = t.raw("items")

  return (
    <section className="bg-white py-20">
      <Container>
        <Carousel
          className="w-full"
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
        >
          <div className="mb-10 flex items-center justify-between">
            <h2 className="font-trajan text-3xl font-extrabold text-primary md:text-5xl">
              {t("title")}
            </h2>

            <div className="flex gap-2">
              <CarouselPrevious className="static h-10 w-10 translate-y-0 border-2 border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000] hover:text-white" />
              <CarouselNext className="static h-10 w-10 translate-y-0 border-2 border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000] hover:text-white" />
            </div>
          </div>

          <CarouselContent>
            {testimonials.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/3">
                <div className="flex h-full flex-col justify-between rounded-xl bg-[#1a824e] p-8 text-white">
                  <div className="mb-4 text-xl text-yellow-500">★★★★★</div>

                  <p className="mb-8 text-lg leading-relaxed italic">
                    {item.text}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/20">
                      <Image
                        src={`/assets/user-${item.id}.png`}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{item.name}</h4>
                      <p className="text-xs tracking-wider uppercase opacity-90">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Container>
    </section>
  )
}
