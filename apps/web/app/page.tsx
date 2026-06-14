"use client"

import { ReactLenis } from "@studio-freight/react-lenis"
import { HeroCarousel } from "@/components/home/hero-slider"
import { UpcomingEvents } from "@/components/home/upcoming-events"
import { AboutSection } from "@/components/home/about-section"
import { WebinarFeatures } from "@/components/home/webinar-features"
import { PrayerSection } from "@/components/home/prayer-secton"
import { TestimonialSection } from "@/components/home/testimonial-section"
import { SupportSection } from "@/components/home/support-section"
import { NewsSection } from "@/components/home/news-section"
import { NewsletterSection } from "@/components/home/news-latter"

export default function Home() {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        wheelMultiplier: 2.0,
      }}
    >
      {/* Background Layer: Fixed position to prevent rendering issues */}
      <div className="fixed inset-0 -z-10 bg-[url('/assets/slide2.jpg')] bg-cover bg-center bg-no-repeat" />

      <main className="relative">
        <HeroCarousel />
        <UpcomingEvents />
        <AboutSection />
        <WebinarFeatures />
        <PrayerSection />
        <TestimonialSection />
        <SupportSection />
        <NewsSection />
        <NewsletterSection />
      </main>
    </ReactLenis>
  )
}
