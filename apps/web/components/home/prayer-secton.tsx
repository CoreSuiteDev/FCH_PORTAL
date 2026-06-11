"use client"

import Container from "@/components/shared/container"
import { useTranslations } from "next-intl"

export function PrayerSection() {
  const t = useTranslations("home.prayer")
  const lines = t.raw("lines") as string[]

  return (
    <section className="relative max-h-[500px] w-full bg-cover bg-fixed bg-center py-16 md:py-22">
      <div className="absolute inset-0 bg-black/60" />

      <Container className="relative z-10 flex flex-col items-center justify-center px-4 text-center text-white">
        <h2 className="mb-8 font-trajan text-3xl tracking-wide md:text-5xl">
          {t("title")}
        </h2>

        <div className="max-w-3xl space-y-4 font-montserrat text-base leading-relaxed italic md:space-y-3 md:text-lg md:text-xl">
          {lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <p className="pt-4 font-normal whitespace-pre-line not-italic">
            {t("closing")}
          </p>
        </div>
      </Container>
    </section>
  )
}
