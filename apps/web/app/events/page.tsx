"use client"

import { ReactLenis } from "@studio-freight/react-lenis"
import { useTranslations } from "next-intl"

import DynamicHero from "@/components/shared/dynamic-hero"
import EventsList from "./_components/event-list"

export default function About() {
  // Initialize the translations for the 'about' namespace
  const t = useTranslations("about")

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
            <h2 className="mb-4 font-serif text-4xl font-bold text-white md:text-6xl">
              {t("hero.title")}
            </h2>

            <p className="mb-8 max-w-2xl text-white md:text-lg">
              {t("hero.description")}
            </p>
          </div>
        </DynamicHero>
        <EventsList />
      </main>
    </ReactLenis>
  )
}
