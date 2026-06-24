"use client"

import { useState } from "react"
import { DollarSign, HandHeart, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import { useRouter } from "next/navigation"

const amounts = [10, 20, 30, 40, 50]

export default function DonateCard() {
  const t = useTranslations("donatePage")
  const router = useRouter()

  const [selected, setSelected] = useState<number | null>(20)
  const [customAmount, setCustomAmount] = useState("")

  const finalAmount = selected ?? (customAmount ? Number(customAmount) : null)

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 pt-30">
      <div className="w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        <h2 className="mb-2 text-center font-trajan text-3xl font-bold text-primary">
          {t("card.title")}
        </h2>

        <div className="mx-auto mb-8 h-1 w-16 rounded-full bg-linear-to-r from-red-400 to-primary" />

        <div className="mb-6 flex items-center gap-2 text-gray-700">
          <HandHeart className="h-5 w-5 text-primary" />
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
              className={`rounded-xl border py-4 ${
                selected === amt
                  ? "bg-red-700 text-white"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              ${amt}
            </button>
          ))}

          <div className="col-span-1">
            <input
              type="number"
              placeholder={t("card.customPlaceholder")}
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value)
                setSelected(null)
              }}
              className="w-full rounded-xl border p-4"
            />
          </div>
        </div>

        <Button
          disabled={!finalAmount}
          onClick={() => router.push(`/donation/${finalAmount}`)}
          className="mt-8 w-full rounded-xl py-6"
        >
          {t("card.button")}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
