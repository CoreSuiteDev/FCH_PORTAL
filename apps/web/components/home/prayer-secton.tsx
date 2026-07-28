"use client"

import Container from "@/components/shared/container"
import { useTranslations } from "next-intl"

export function PrayerSection() {
  const t = useTranslations("home.prayer")
  const lines = t.raw("lines") as string[]

  return (
    <section className="relative flex min-h-[400px] w-full items-center justify-center bg-cover bg-fixed bg-center py-16 md:min-h-[550px] md:py-24">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <Container className="relative z-10 flex flex-col items-center justify-center px-6 text-center text-white">
        <h2 className="mb-6 font-trajan text-2xl font-extrabold tracking-wide md:mb-10 md:text-5xl">
          {t("title")}
        </h2>

        <div className="max-w-4xl space-y-3 font-montserrat text-sm leading-relaxed italic md:space-y-4 md:text-lg lg:text-xl">
          {lines.map((line, index) => (
            <p key={index} className="break-words">
              {line}
            </p>
          ))}
          <p className="pt-4 font-normal not-italic opacity-90">
            {t("closing")}
          </p>
        </div>
      </Container>
    </section>
  )
}
