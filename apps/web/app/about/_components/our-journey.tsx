"use client"

import React from "react"
import Container from "@/components/shared/container"

const OurJourney: React.FC = () => {
  return (
    <section className="bg-white py-24">
      <Container className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-4xl text-[#800000]">Our Journey</h2>
            <p className="leading-relaxed text-gray-700">
              Originally established as a collaborative Forum, FaithCommunity
              evolved through a shared vision of national unity. Recognizing the
              growing need for a dedicated, autonomous voice for Hispanic
              catechesis, we transitioned into an independent national
              organization.
            </p>
            <p className="leading-relaxed text-gray-700">
              This transition allowed us to expand our reach, formalize our
              leadership structures, and create more impactful partnerships with
              dioceses and educational institutions across the country.
            </p>
          </div>

          {/* Right Stats Block */}
          {/* Using a wrapper to contain the background box seen in the design */}
          <div className="bg-[#FBF9F8] p-8 md:p-14">
            <div className="grid grid-cols-2 overflow-hidden bg-[#F3F3F3]">
              {/* Stat 1: 20+ Years */}
              <div className="flex h-190 flex-col items-center justify-center md:h-[260px]">
                <span className="text-5xl text-red-800">20+</span>
                <span className="mt-2 text-sm font-semibold text-gray-600">
                  Years of Service
                </span>
              </div>

              {/* Stat 2: 50 Partners */}
              <div className="flex flex-col items-center justify-center bg-[#B82A32] py-12 text-white">
                <span className="text-5xl">50</span>
                <span className="mt-2 text-sm font-medium text-white">
                  Diocesan Partners
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default OurJourney
