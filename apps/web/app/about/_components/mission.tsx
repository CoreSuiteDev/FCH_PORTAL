import Container from "@/components/shared/container"
import React from "react"

const MissionSection: React.FC = () => {
  return (
    <section className="bg-[#FFB74D]! py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Left: Mission Statement */}
          <div className="space-y-4">
            <h2 className="text-lg text-red-700 uppercase">Our Mission</h2>
            <p className="font-serif text-5xl leading-tight text-green-800 italic">
              TO SERVE THOSE WHO MINISTER IN CATECHESIS WITH HISPANICS.
            </p>
          </div>

          {/* Right: Who We Serve */}
          <div className="space-y-4">
            <h2 className="text-lg text-red-700 uppercase">Who We Serve</h2>
            <p className="text-lg leading-relaxed text-gray-900">
              FCH is here for those who serve, lead, and accompany
              Hispanic/Latino communities in faith formation and evangelization.
            </p>
            <p className="text-lg leading-relaxed text-gray-900">
              We support diocesan leaders, parish catechists, ministry
              volunteers, educators, organizations, and pastoral leaders at
              every level. Whether you are experienced in catechetical ministry
              or just beginning your journey, FCH provides support, guidance,
              resources, and a community committed to walking with you.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default MissionSection
