"use client"

import { CheckCircle2, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export default function ImpactAndMissionSection() {
  const t = useTranslations("donatePage.impact")
  const points: string[] = t.raw("points")

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 font-trajan text-4xl font-bold text-primary">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600">{t("description")}</p>
          </motion.div>

          <div className="space-y-4">
            {points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex gap-4 rounded-xl border border-transparent p-4 transition-colors hover:border-gray-50 hover:bg-gray-50"
              >
                <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-primary" />
                <span className="leading-relaxed text-gray-700">{point}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -top-6 -left-6 text-emerald-100">
            <Heart size={80} fill="currentColor" />
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-[#008236] p-10 text-white shadow-2xl md:p-12">
            <h3 className="mb-6 font-trajan text-2xl font-bold">
              {t("card.title")}
            </h3>
            <div className="space-y-6 text-lg leading-relaxed italic">
              <p>{`"${t("card.quote")}"`}</p>
              <p className="text-white not-italic">{t("card.description")}</p>
              <p className="border-t border-emerald-700 pt-6 font-semibold text-white">
                {t("card.footer")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
