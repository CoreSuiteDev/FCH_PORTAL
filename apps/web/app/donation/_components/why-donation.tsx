"use client"

import { useTranslations } from "next-intl"
import { BookOpen, Video, Award, Users } from "lucide-react"
import Container from "@/components/shared/container"

const icons = {
  BookOpen,
  Video,
  Award,
  Users,
}

export default function WhySupportSection() {
  const t = useTranslations("donatePage")

  const reasons = t.raw("whySupport.reasons")

  return (
    <section className="bg-gray-50 px-6 py-20">
      <Container className="">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-trajan text-3xl font-bold text-primary md:text-4xl">
            {t("whySupport.title")}
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {t("whySupport.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item: any, idx: number) => {
            const Icon = icons[item.icon as keyof typeof icons] || BookOpen

            return (
              <div
                key={idx}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-red-50 transition-colors group-hover:bg-primary">
                  <Icon className="h-8 w-8 text-primary transition-colors group-hover:text-white" />
                </div>

                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
