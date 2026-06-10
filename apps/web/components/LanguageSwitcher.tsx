"use client"

import React, { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"

export function LanguageSwitcher() {
  const router = useRouter()
  const currentLocale = useLocale()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value
    startTransition(() => {
      // Set cookie for next-intl to read
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 font-medium">Language:</span>
      <select
        value={currentLocale}
        onChange={handleLanguageChange}
        disabled={isPending}
        className="rounded border border-slate-300 bg-white px-2.5 py-1 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
      >
        <option value="en">English</option>
        <option value="es">Español (Spanish)</option>
      </select>
    </div>
  )
}
