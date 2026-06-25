"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import { useRouter } from "next/navigation"

export default function DonationSection() {
  const t = useTranslations("donatePage.donationSection")
  const router = useRouter()

  const donationOptions = t.raw("options") as {
    amount: number
    label: string
  }[]

  const [selected, setSelected] = useState<number | null>(50)
  const [customAmount, setCustomAmount] = useState("")

  const finalAmount = selected ?? (customAmount ? Number(customAmount) : null)

  return (
    <section className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-gray-100 bg-white p-8 shadow-xl md:p-12">
        {/* Title */}
        <h2 className="mb-2 text-center font-trajan text-3xl font-bold text-primary">
          {t("title")}
        </h2>
        <div className="mx-auto mb-10 h-1 w-16 rounded-full bg-linear-to-r from-red-400 to-primary" />

        {/* Donation Grid */}
        <div className="mb-10 grid gap-4">
          {donationOptions.map((opt) => (
            <button
              key={opt.amount}
              onClick={() => {
                setSelected(opt.amount)
                setCustomAmount("")
              }}
              className={`rounded-2xl border-2 p-6 text-left transition-all ${
                selected === opt.amount
                  ? "border-primary bg-red-50"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <div className="mb-1 text-2xl font-bold text-primary">
                ${opt.amount}
              </div>
              <div className="text-gray-600">{opt.label}</div>
            </button>
          ))}
        </div>

        {/* Custom Amount Section */}
        <div className="mb-10">
          <label className="mb-3 block text-sm font-semibold text-gray-700">
            {t("customLabel")}
          </label>
          <input
            type="number"
            placeholder={t("customPlaceholder")}
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value)
              setSelected(null)
            }}
            className="w-full rounded-xl border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Final CTA Section */}
        <div className="text-center">
          <p className="mb-6 text-gray-500 italic">{t("footer")}</p>
          <Button
            disabled={!finalAmount}
            onClick={() => router.push(`/donation/${finalAmount}`)}
            className="w-full rounded-xl bg-primary py-8 text-lg font-semibold hover:bg-red-800"
          >
            {t("button")}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
