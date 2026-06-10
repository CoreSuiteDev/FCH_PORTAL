import { useTranslations } from "next-intl"
import { HeroCarousel } from "./_components/hero-slider"

export default function Page() {
  const t = useTranslations("home")

  return (
    <div>
      <HeroCarousel />
    </div>
  )
}
