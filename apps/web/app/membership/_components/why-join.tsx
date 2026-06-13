"use client"
import React from "react"
import { motion } from "framer-motion"
import { Users, TrendingUp, Star, Network } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const featureKeys = [
  { key: "community", icon: Users },
  { key: "ethical", icon: TrendingUp },
  { key: "spiritual", icon: Star },
  { key: "resources", icon: Network },
]

export default function WhyJoin() {
  const t = useTranslations("membership.whyJoin")
  
  const features = featureKeys.map((item) => ({
    title: t(`features.${item.key}.title`),
    desc: t(`features.${item.key}.desc`),
    icon: item.icon,
  }))

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl text-center">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-2 text-sm font-medium tracking-[0.2em] text-primary uppercase">
            {t("subtitle")}
          </p>
          <h2 className="mb-16 text-4xl font-semibold text-primary md:text-5xl">
            {t("title")}
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full border-none bg-[#fdfafa] shadow-md transition-shadow hover:shadow-xl">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fce8e8]">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold text-primary">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
