"use client"

import React, { useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useSpring, useTransform, useInView } from "framer-motion"
import { useTranslations } from "next-intl"
import Container from "@/components/shared/container"

function Counter({ value }: { value: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const spring = useSpring(0, { duration: 3, bounce: 0 })

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  )

  return <motion.span ref={ref}>{display}</motion.span>
}

export default function SponsorshipPartner() {
  const t = useTranslations("sponsorship.whyPartner")
  const stats = t.raw("stats") as { value: number; label: string }[]

  return (
    <div className="bg-white">
      <section className="bg-[#FBF9F8] px-4 py-16">
        <Container className="mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/3] w-full lg:w-1/2"
          >
            <Image
              src="/assets/sopnsor-partner.png"
              alt="Team meeting"
              fill
              className="rounded-lg object-cover shadow-lg"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="mb-6 font-serif text-4xl font-bold text-red-900">
                {t("title")}
              </h2>
              <p className="mb-8 leading-relaxed text-gray-700">
                {t("description")}
              </p>
            </motion.div>

            <div className="flex gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
                  className="flex min-w-[140px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <span className="text-3xl font-bold text-red-800">
                    <Counter value={stat.value} />+
                  </span>
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
