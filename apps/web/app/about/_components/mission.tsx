"use client"

import Container from "@/components/shared/container"
import React from "react"
import { useTranslations } from "next-intl"

const MissionSection: React.FC = () => {
  const t = useTranslations("about.mission")

  return (
    <section className="bg-[#FFB74D]! py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Left: Mission Statement */}
          <div className="space-y-4">
            <h2 className="font-trajan text-xl font-bold text-primary">
              {t("missionTitle")}
            </h2>
            <p className="font-serif text-5xl leading-tight text-green-800 italic">
              {t("missionText")}
            </p>
          </div>

          {/* Right: Who We Serve */}
          <div className="space-y-4">
            <h2 className="font-trajan text-xl font-bold text-primary">
              {t("serveTitle")}
            </h2>
            <p className="text-lg leading-relaxed text-gray-900">
              {t("serveText1")}
            </p>
            <p className="text-lg leading-relaxed text-gray-900">
              {t("serveText2")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default MissionSection
