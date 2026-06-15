"use client"

import React, { useEffect } from "react"
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion"
import { useRef } from "react"
import Container from "@/components/shared/container"
import { useTranslations } from "next-intl"

const Counter = ({ from, to }: { from: number; to: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(nodeRef, { once: true })
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration: 2 })
      return () => controls.stop()
    }
  }, [isInView, count, to])

  return <motion.span ref={nodeRef}>{rounded}</motion.span>
}

const OurJourney: React.FC = () => {
  const t = useTranslations("about.journey")

  return (
    <section className="bg-white py-24">
      <Container className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="font-trajan text-4xl font-bold text-primary">
              {t("title")}
            </h2>
            <p className="leading-relaxed text-gray-700">{t("description1")}</p>
            <p className="leading-relaxed text-gray-700">{t("description2")}</p>
          </div>

          <div className="bg-[#FBF9F8] p-8 md:p-14">
            <div className="grid grid-cols-2 overflow-hidden bg-[#F3F3F3]">
              <div className="flex h-[190px] flex-col items-center justify-center md:h-[255px]">
                <div className="text-5xl text-red-800">
                  <Counter from={0} to={20} />+
                </div>
                <span className="mt-2 text-sm font-semibold text-gray-600">
                  {t("yearsLabel")}
                </span>
              </div>

              <div className="flex h-[190px] flex-col items-center justify-center bg-[#B82A32] py-12 text-white md:h-[255px]">
                <div className="text-5xl">
                  <Counter from={0} to={50} />+
                </div>
                <span className="mt-2 text-sm font-medium text-white">
                  {t("partnersLabel")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default OurJourney
