"use client"
import { Card, CardContent } from "@workspace/ui/components/card"
import Container from "@/components/shared/container"
import { motion } from "framer-motion"
import { webinarFeatures } from "@/constents/features-data"

export function WebinarFeatures() {
  return (
    <section className="bg-white py-24">
      <Container>
        {/* Header - Optimized for professional hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-trajan text-3xl leading-[1.2] tracking-normal text-[#8b1a1a] md:text-5xl">
            CONNECT ANYWHERE WITH
            <br /> OUR WEBINARS
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-montserrat text-base leading-relaxed text-gray-700">
            Bringing world-class catechetical formation directly to your home or
            parish office through our accessible digital platform
          </p>
        </motion.div>

        {/* Grid - Tightened gap for consistency with your design */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {webinarFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }} // Smooth floating animation
            >
              <Card className="h-full border-none bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(139,26,26,0.12)]">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  {/* Icon Box - Perfectly rounded and centered */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-[#8b1a1a] text-white shadow-md">
                    <feature.icon className="h-8 w-8" strokeWidth={1.5} />
                  </div>

                  {/* Title - Using font-trajan */}
                  <h3 className="mb-4 font-trajan text-[15px] font-bold tracking-wider text-[#8b1a1a] uppercase">
                    {feature.title}
                  </h3>

                  {/* Description - Montserrat for legibility */}
                  <p className="font-montserrat text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
