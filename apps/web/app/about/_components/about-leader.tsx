"use client"

import Image from "next/image"
import Container from "@/components/shared/container"
import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTranslations } from "next-intl"

export function AboutLeader() {
  const t = useTranslations("home.about")

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-64 w-full overflow-hidden rounded-sm shadow-xl md:h-[400px] lg:h-[600px]"
          >
            <Image
              src="/assets/about-image.png"
              alt="About FCH Catechesis"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h2 className="font-trajan text-4xl text-[#8b1a1a]">
              {t("title")}
            </h2>
            <p className="font-montserrat text-[18px] leading-relaxed text-gray-800">
              {t("description1")}
            </p>
            <p className="font-montserrat text-[18px] leading-relaxed text-gray-800">
              {t("description2")}
            </p>
            <div className="mt-2">
              <Link href="/about">
                <Button className="h-auto rounded-sm bg-[#e6a84d] px-8 py-3 font-montserrat font-semibold text-black transition-colors hover:bg-[#d6983d]">
                  {t("button")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
