import React from "react"
import Container from "@/components/shared/container"

interface DynamicHeroProps {
  children: React.ReactNode
}

const DynamicHero = ({ children }: DynamicHeroProps) => {
  return (
    <section className="relative h-[350] overflow-hidden md:h-[450px]">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#8b1d22]/90 via-[#8b1d22]/60 to-transparent" />

      <Container className="border-green relative z-10 flex h-full items-center">
        {children}
      </Container>
    </section>
  )
}

export default DynamicHero
