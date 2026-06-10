"use client"

import { ReactLenis } from "@studio-freight/react-lenis"
import { HeroCarousel } from "@/components/home/hero-slider"
import { UpcomingEvents } from "@/components/home/upcoming-events"
import { AboutSection } from "@/components/home/about-section"
import { WebinarFeatures } from "@/components/home/webinar-features"
import { PrayerSection } from "@/components/home/prayer-secton"
import { TestimonialSection } from "@/components/home/testimonial-section"

export default function Page() {
  return (
    // 'lerp' er man adjust kore scroll er smoothness control korun
    <ReactLenis root options={{ lerp: 0.07, duration: 1.2, smoothWheel: true }}>
      <main className="relative bg-[url('/assets/slide2.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
        <div>
          <HeroCarousel />
          <UpcomingEvents />
          <AboutSection />
          <WebinarFeatures />
          <PrayerSection />
          <TestimonialSection />
        </div>
      </main>
    </ReactLenis>
  )
}
