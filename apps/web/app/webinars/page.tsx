"use client"

import { ReactLenis } from "@studio-freight/react-lenis"

import DynamicHero from "@/components/shared/dynamic-hero"
import UpcomingWebiners from "./_components/upcoming-webiners"

export default function About() {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        wheelMultiplier: 2.0,
      }}
    >
      {/* Background Layer: Fixed position to prevent rendering issues */}
      <div className="fixed inset-0 -z-10 bg-[url('/assets/about-baner.jpg')] bg-cover bg-center bg-no-repeat" />

      <main className="relative">
        <DynamicHero>
          <div className="relative z-10">
            <h2 className="mb-4 font-serif text-4xl font-bold text-white md:text-6xl">
              Join Our Webinars
            </h2>

            <p className="md:text-md mb-8 max-w-2xl text-white">
              FCH webinars provide virtual formation opportunities for
              catechists, ministry leaders, and pastoral communities serving
              Hispanic Catholics. Through live webinars and on-demand resources,
              FCH is building a growing Learning Library to support faith
              formation, leadership development, and ministry service across our
              community.
            </p>
          </div>
        </DynamicHero>
        <UpcomingWebiners />
      </main>
    </ReactLenis>
  )
}
