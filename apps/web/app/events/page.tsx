"use client"

import { ReactLenis } from "@studio-freight/react-lenis"

import DynamicHero from "@/components/shared/dynamic-hero"
import UpcomingEvents from "./components/upcoming-event"

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
              Gather. Learn. Celebrate. Grow in Faith.
            </h2>

            <p className="md:text-md mb-8 max-w-2xl text-white">
              FCH events bring people together to learn, celebrate, and grow in
              our shared mission of catechesis and ministry. Explore upcoming
              gatherings, webinars, and opportunities to connect with others
              serving Hispanic Catholic communities.
            </p>
          </div>
        </DynamicHero>
        <UpcomingEvents />
      </main>
    </ReactLenis>
  )
}
