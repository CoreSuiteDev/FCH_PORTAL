"use client"

import React, { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"

export function LanguageSwitcher() {
  const router = useRouter()
  const currentLocale = useLocale()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (nextLocale: string) => {
    if (nextLocale === currentLocale) return

    startTransition(() => {
      // Set cookie for next-intl to read
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 rounded-full border border-slate-300 bg-white p-0.5 text-[10px] dark:border-slate-700 dark:bg-slate-800">
        <button
          onClick={() => handleLanguageChange("en")}
          disabled={isPending}
          className={`rounded-full px-2 py-1 font-medium transition-colors ${
            currentLocale === "en"
              ? "bg-red-600 text-white"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange("es")}
          disabled={isPending}
          className={`rounded-full px-2 py-1 font-medium transition-colors ${
            currentLocale === "es"
              ? "bg-red-600 text-white"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          ES
        </button>
      </div>
    </div>
  )
}
