"use client"

import Container from "@/components/shared/container"
import { supportData } from "@/constents/support-data"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"

export function SupportSection() {
  return (
    <section className="overflow-hidden bg-[#b91c1c] py-24">
      <Container>
        <div className="grid items-stretch gap-8 md:grid-cols-2">
          {/* Left: Premium Image Card */}
          <div className="group relative flex min-h-[400px] items-end overflow-hidden rounded-3xl p-10 shadow-2xl transition-all duration-500">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              style={{ backgroundImage: "url('/assets/slide1.jpg')" }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="relative z-10 translate-y-4 text-white transition-transform duration-500 group-hover:translate-y-0">
              <h3 className="mb-4 text-3xl leading-tight font-bold tracking-wide md:text-4xl">
                {supportData.title}
              </h3>
              <p className="border-l-2 border-white/30 pl-4 text-sm leading-relaxed italic opacity-80">
                {supportData.description}
              </p>
            </div>
          </div>

          {/* Right: Support Card */}
          <div className="relative flex flex-col items-center justify-center rounded-3xl bg-white/95 p-10 text-center shadow-2xl backdrop-blur-sm transition-all duration-500">
            {/* Decorative dashed border */}
            <div className="pointer-events-none absolute inset-2 rounded-2xl border-2 border-dashed border-[#8b0000]/20" />

            <h3 className="mb-6 text-3xl font-bold tracking-wider text-[#8b0000]">
              {supportData.supportTitle}
            </h3>

            <p className="mb-10 max-w-sm leading-relaxed font-medium text-gray-600">
              {supportData.supportText}
            </p>
            <Link href="/donation/">
              <Button className="group relative overflow-hidden rounded-full bg-[#1a824e] px-10 py-6 text-lg text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#156a40] hover:shadow-2xl">
                <span className="relative z-10 flex items-center gap-2">
                  {supportData.buttonText}
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
