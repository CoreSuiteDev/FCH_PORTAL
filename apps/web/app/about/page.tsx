"use client"

import { ReactLenis } from "@studio-freight/react-lenis"
import { useTranslations } from "next-intl"

import DynamicHero from "@/components/shared/dynamic-hero"
import AboutFCH from "./_components/aboutFCH"
import MissionSection from "./_components/mission"
import OurJourney from "./_components/our-journey"
import OurProfessionalApproach from "./_components/our-approach"
import { AboutLeader } from "./_components/about-leader"
import BoardMembers from "./_components/board-member"
import CollaborationObjectives from "./_components/objectives"
import ConnectWithUs from "./_components/connect-with-us"

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
        <AboutFCH />
        <MissionSection />
        <OurJourney />
        <OurProfessionalApproach />
        <AboutLeader />
        <BoardMembers />
        <CollaborationObjectives />
        <ConnectWithUs />
      </main>
    </ReactLenis>
  )
}
