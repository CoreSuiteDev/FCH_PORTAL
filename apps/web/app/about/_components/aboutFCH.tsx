"use client"

import Container from "@/components/shared/container"
import Image from "next/image"
import { useTranslations } from "next-intl"

export default function AboutFCH() {
  const t = useTranslations("about.fch")

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <Container className="grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-bold text-red-700 uppercase md:text-4xl">
              {t("title")}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-gray-700 md:text-base">
              {t("description1")}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-gray-700 md:text-base">
              {t("description2")}
            </p>

            <h3 className="mt-8 text-lg font-semibold uppercase md:text-xl">
              {t("historyTitle")}
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-gray-700 md:text-base">
              {t("historyDescription")}
            </p>
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="flex items-center gap-4">
          {/* Big image */}
          <div className="h-[550px] w-full overflow-hidden rounded-2xl">
            <Image
              src="/assets/about-fch.jpeg"
              alt="church"
              width={500}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-3">
            {/* small image 1 */}
            <div className="h-[360px] w-full overflow-hidden rounded-2xl">
              <Image
                src="/assets/event-2.jpg"
                alt="prayer"
                width={400}
                height={300}
                className="h-full w-full object-cover"
              />
            </div>

            {/* small image 2 */}
            <div className="h-[180px] w-full overflow-hidden rounded-2xl">
              <Image
                src="/assets/slide3.jpg"
                alt="cross"
                width={400}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
