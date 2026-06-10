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

import Image from "next/image" // Import Next.js Image component
import { testimonials } from "@/constents/testimonial-data"

export function TestimonialSection() {
  return (
    <section className="bg-white py-20">
      <Container>
        <Carousel className="w-full">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="font-trajan text-3xl text-[#8b0000] md:text-4xl">
              WHAT PEOPLE SAY
            </h2>

            <div className="flex gap-2">
              <CarouselPrevious className="static h-10 w-10 translate-y-0 border-2 border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000] hover:text-white" />
              <CarouselNext className="static h-10 w-10 translate-y-0 border-2 border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000] hover:text-white" />
            </div>
          </div>

          <CarouselContent>
            {testimonials.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2">
                <div className="flex h-full flex-col justify-between rounded-xl bg-[#1a824e] p-8 text-white">
                  <div className="mb-4 text-xl text-yellow-500">★★★★★</div>

                  <p className="mb-8 text-lg leading-relaxed italic">
                    {item.text}
                  </p>

                  <div className="flex items-center gap-4">
                    {/* Render the profile image */}
                    <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/20">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-cover"
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
