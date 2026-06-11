"use client"

import { ReactLenis } from "@studio-freight/react-lenis"

import DynamicHero from "@/components/shared/dynamic-hero"
import Sponsorship from "./_components/sopnsor-ship"
import WhyPartnerWithUs from "./_components/why-partner-with-us"
import HaveQuestions from "./_components/have-questions"

export default function About() {
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
      <div className="fixed inset-0 -z-10 bg-[url('/assets/about-baner.jpg')] bg-cover bg-center bg-no-repeat" />

      <main className="relative">
        <DynamicHero>
          <div className="relative z-10">
            <h2 className="mb-4 font-serif text-4xl font-bold text-white md:text-6xl">
              Partner With Us in Mission
            </h2>

            <p className="mb-8 max-w-2xl text-white md:text-lg">
              Support FCH’s work in advancing catechesis, faith formation, and
              community engagement within Hispanic Catholic communities. Your
              sponsorship helps make our programs, events, and resources
              possible
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl bg-[#f5a623] px-8 py-4 font-semibold text-black hover:bg-[#e29100]">
                View Sponsorship Tiers
              </button>

              <button className="rounded-xl bg-white px-8 py-4 font-semibold text-black hover:bg-gray-100">
                Inquire Today
              </button>
            </div>
          </div>
        </DynamicHero>
        <Sponsorship />
        <WhyPartnerWithUs />
        <HaveQuestions />
      </main>
    </ReactLenis>
  )
}
