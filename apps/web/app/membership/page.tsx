"use client"

import { ReactLenis } from "@studio-freight/react-lenis"
import { useTranslations } from "next-intl"

import DynamicHero from "@/components/shared/dynamic-hero"
import WhyJoin from "./_components/why-join"
import MembershipPackages from "./_components/membership"

export default function Membership() {
  const t = useTranslations("membership.hero")

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
            <h2 className="mb-4 font-trajan text-4xl font-bold whitespace-pre-line text-white md:text-5xl">
              {t("title")}
            </h2>

            <p className="mb-8 max-w-2xl text-white md:text-lg">
              {t("description")}
            </p>
          </div>
        </DynamicHero>
        <WhyJoin />
        <MembershipPackages />
      </main>
    </ReactLenis>
  )
}
