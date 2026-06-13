"use client"

import { ReactLenis } from "@studio-freight/react-lenis"
import { useTranslations } from "next-intl"

import DynamicHero from "@/components/shared/dynamic-hero"
import { LatestNewsSection } from "./_components/latest-news"
import MoreNewsSection from "./_components/more-news"

export default function NewsPage() {
  const t = useTranslations("newsPage.hero")

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
              {t("title")}
            </h2>

            <p className="md:text-md mb-8 max-w-2xl text-white">
              {t("description")}
            </p>
          </div>
        </DynamicHero>

        <LatestNewsSection />
        <MoreNewsSection />
      </main>
    </ReactLenis>
  )
}
