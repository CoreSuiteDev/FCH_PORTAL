"use client"

import { ReactLenis } from "@studio-freight/react-lenis"
import { useTranslations } from "next-intl"

import DynamicHero from "@/components/shared/dynamic-hero"
import FchHistory from "./_components/fch-history"

export default function About() {
  const t = useTranslations("about.hero")

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
            <h2 className="mb-4 font-trajan text-4xl font-extrabold text-white md:text-5xl">
              {t("title")}
            </h2>

            <p className="mb-8 max-w-2xl text-white md:text-lg">
              {t("description")}
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl bg-[#f5a623] px-8 py-4 font-semibold text-black hover:bg-[#e29100]">
                {t("buttonSponsor")}
              </button>

              <button className="rounded-xl bg-white px-8 py-4 font-semibold text-black hover:bg-gray-100">
                {t("buttonInquire")}
              </button>
            </div>
          </div>
        </DynamicHero>
        <FchHistory />
      </main>
    </ReactLenis>
  )
}
