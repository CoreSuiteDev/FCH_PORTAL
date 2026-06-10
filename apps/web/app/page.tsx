import { useTranslations } from "next-intl"
import { HeroCarousel } from "../components/home/hero-slider"
import { UpcomingEvents } from "../components/home/upcoming-events"
import { AboutSection } from "@/components/home/about-section"

export default function Page() {
  const t = useTranslations("home")

  return (
    <div>
      <HeroCarousel />
      <UpcomingEvents />
      <AboutSection />
    </div>
  )
}
