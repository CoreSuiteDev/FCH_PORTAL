"use client"

import React from "react"
import { useTranslations } from "next-intl"

export default function HaveQuestions() {
  const t = useTranslations("sponsorship.haveQuestions")

  return (
    <section
      className="relative flex min-h-[400px] w-full items-center justify-center bg-cover bg-center py-20"
      style={{ backgroundImage: "url('/assets/Have.webp')" }}
    >
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl px-4 text-center text-white">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight whitespace-pre-line md:text-3xl lg:text-5xl">
          {t("title")}
        </h2>
        <p className="mb-8 text-lg leading-relaxed text-gray-200 md:text-lg">
          {t("description")}
        </p>

        <button className="rounded-md bg-white px-8 py-3 font-semibold text-black transition-colors duration-200 hover:bg-gray-100">
          {t("button")}
        </button>
      </div>
    </section>
  )
}
