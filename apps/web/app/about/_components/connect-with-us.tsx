"use client"

import React from "react"
import { useTranslations } from "next-intl"

export default function ConnectWithUs() {
  const t = useTranslations("about.connect")

  return (
    <section
      className="relative flex h-[400px] w-full items-center justify-center bg-cover bg-center px-6"
      style={{ backgroundImage: "url('/assets/helping.webp')" }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 mx-auto flex h-[250px] w-full max-w-5xl flex-col items-center justify-between gap-6 rounded-lg bg-[#282523]/90 p-8 shadow-2xl backdrop-blur-sm md:flex-row md:p-12">
        <div className="max-w-xl text-center text-white md:text-left">
          <h2 className="mb-4 font-trajan text-3xl font-bold">{t("title")}</h2>
          <p className="text-gray-300">{t("description")}</p>
        </div>

        <button className="shrink-0 rounded-md bg-[#8B0000] px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#a00000]">
          {t("button")}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 h-2 w-full bg-[#8B0000]"></div>
    </section>
  )
}
