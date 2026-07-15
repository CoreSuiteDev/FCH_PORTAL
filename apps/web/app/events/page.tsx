"use client"

import { ReactLenis } from "@studio-freight/react-lenis"
import { useTranslations } from "next-intl"

import DynamicHero from "@/components/shared/dynamic-hero"
import EventsList from "./_components/event-list"

export default function EventsPage() {
  const t = useTranslations("eventsList")

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
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10 bg-[url('/assets/about-baner.jpg')] bg-cover bg-center bg-no-repeat" />

      <main className="relative">
        <DynamicHero>
          <div className="relative z-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-white/70">
              Community & Faith
            </p>
            <h1 className="mb-4 font-trajan text-4xl font-bold text-white md:text-5xl">
              {t("title")}
            </h1>
            <p className="mb-8 max-w-2xl text-white/80 md:text-lg">
              Join us for upcoming gatherings, free webinars, and community events
              open to all.
            </p>
          </div>
        </DynamicHero>

        <EventsList />
      </main>
    </ReactLenis>
  )
}
