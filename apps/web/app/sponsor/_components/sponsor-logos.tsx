import Image from "next/image"
import React from "react"

import { Marquee } from "@workspace/ui/components/marquee"
import { useTranslations } from "next-intl"
interface SopnsorsLogos {
  id: number
  name: string
  src: string
}

export function SponsorLogos() {
  const t = useTranslations("sponsorship.ourSponsors")
  const sponsors: SopnsorsLogos[] = [
    {
      id: 1,
      name: "JS",
      src: "https://cdn-icons-png.flaticon.com/128/5968/5968292.png",
    },
    {
      id: 2,
      name: "Bootstrap",
      src: "https://cdn-icons-png.flaticon.com/128/5968/5968672.png",
    },
    {
      id: 3,
      name: "Gmail",
      src: "https://cdn-icons-png.flaticon.com/128/5968/5968534.png",
    },
    {
      id: 4,
      name: "Figma",
      src: "https://cdn-icons-png.flaticon.com/128/5968/5968705.png",
    },
    {
      id: 5,
      name: "Python",
      src: "https://cdn-icons-png.flaticon.com/128/5968/5968350.png",
    },
  ]
  return (
    <div className="relative flex w-full flex-col items-center justify-center bg-white py-14">
      <h2 className="mb-12 text-center font-trajan text-4xl font-extrabold tracking-wide whitespace-pre-line text-primary">
        {t("title")}
      </h2>

      <Marquee pauseOnHover className="[--duration:20s]">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="flex h-16 w-32 flex-shrink-0 items-center justify-center px-4 grayscale transition-all duration-300 hover:grayscale-0"
          >
            <Image
              src={sponsor.src}
              alt={sponsor.name}
              width={64}
              height={64}
              className="max-h-full object-contain opacity-60 transition-opacity hover:opacity-100"
            />
          </div>
        ))}
      </Marquee>

      {/* Gradient Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent"></div>
    </div>
  )
}
