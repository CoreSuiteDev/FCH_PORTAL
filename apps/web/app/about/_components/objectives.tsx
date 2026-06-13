"use client"

import React from "react"
import { CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"

interface ObjectiveItem {
  title: string
  description: string
}

export default function CollaborationObjectives() {
  const t = useTranslations("about.objectives")
  const items: ObjectiveItem[] = t.raw("items")

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 md:grid-cols-3">
        {/* Title Section */}
        <h2 className="text-3xl font-bold text-primary md:text-4xl whitespace-pre-line">
          {t("title")}
        </h2>

        {/* Objectives Grid */}
        <div className="col-span-1 grid grid-cols-1 gap-x-8 gap-y-10 md:col-span-2 md:grid-cols-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="mt-1 shrink-0 text-primary" size={24} />
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-1 leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
