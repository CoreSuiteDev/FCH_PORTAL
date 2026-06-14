"use client"

import React from "react"
import Container from "@/components/shared/container"
import { useTranslations } from "next-intl"

const OurJourney: React.FC = () => {
  const t = useTranslations("about.journey")

  return (
    <section className="bg-white py-24">
      <Container className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="font-trajan text-4xl font-bold text-primary">
              {t("title")}
            </h2>
            <p className="leading-relaxed text-gray-700">{t("description1")}</p>
            <p className="leading-relaxed text-gray-700">{t("description2")}</p>
          </div>

          {/* Right Stats Block */}
          {/* Using a wrapper to contain the background box seen in the design */}
          <div className="bg-[#FBF9F8] p-8 md:p-14">
            <div className="grid grid-cols-2 overflow-hidden bg-[#F3F3F3]">
              {/* Stat 1: 20+ Years */}
              <div className="flex h-[190px] flex-col items-center justify-center md:h-[255px]">
                <span className="text-5xl text-red-800">{t("years")}</span>
                <span className="text-gray-666 mt-2 text-sm font-semibold">
                  {t("yearsLabel")}
                </span>
              </div>

              {/* Stat 2: 50 Partners */}
              <div className="flex h-[190px] flex-col items-center justify-center bg-[#B82A32] py-12 text-white md:h-[255px]">
                <span className="text-5xl">{t("partners")}</span>
                <span className="mt-2 text-sm font-medium text-white">
                  {t("partnersLabel")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default OurJourney
