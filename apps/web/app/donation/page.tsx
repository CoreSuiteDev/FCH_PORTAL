"use client"

import { useState } from "react"
import { DollarSign, HandHeart, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"

const amounts = [10, 20, 30, 40, 50]

export default function DonateCard() {
  const t = useTranslations("donateCard")
  const [selected, setSelected] = useState<number | null>(20)
  const [customAmount, setCustomAmount] = useState("")

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 pt-30">
      <div className="w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
        <h2 className="mb-2 text-center text-3xl font-bold text-red-900">
          {t("title")}
        </h2>
        <div className="mx-auto mb-8 h-1 w-16 rounded-full bg-linear-to-r from-red-400 to-red-600" />

        <div className="mb-6 flex items-center gap-2 text-gray-700">
          <HandHeart className="h-5 w-5 text-red-600" />
          <span className="font-semibold">{t("prompt")}</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {amounts.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setSelected(amt)
                setCustomAmount("")
              }}
              className={`flex items-center justify-center gap-2 rounded-xl border py-4 font-medium transition-all ${
                selected === amt
                  ? "bg-red-700 text-white shadow-lg ring-2 shadow-red-200 ring-red-300"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <DollarSign className="h-4 w-4" />
              {amt}
            </button>
          ))}

          <div className="relative col-span-1">
            <div className="flex h-full items-center rounded-xl border bg-gray-50 px-3 focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-600">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <input
                type="number"
                placeholder={t("customPlaceholder")}
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelected(null)
                }}
                className="w-full bg-transparent p-2 text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <Button className="mt-8 w-full rounded-xl bg-red-800 py-6 text-lg font-semibold transition-colors hover:bg-red-900">
          {t("button")} <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
