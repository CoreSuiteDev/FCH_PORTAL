import { HeroCarousel } from "@/components/home/hero-slider"
import { UpcomingEvents } from "@/components/home/upcoming-events"
import { AboutSection } from "@/components/home/about-section"
import { WebinarFeatures } from "@/components/home/webinar-features"
import { PrayerSection } from "@/components/home/prayer-secton"
import { TestimonialSection } from "@/components/home/testimonial-section"

export default function Page() {
  return (
    <main className="relative bg-[url('/assets/slide2.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      {/* Semi-transparent overlay to keep content readable */}
      <div className="">
        <HeroCarousel />
        <UpcomingEvents />
        <AboutSection />
        <WebinarFeatures />
        <PrayerSection />
        <TestimonialSection />
      </div>
    </main>
  )
}
