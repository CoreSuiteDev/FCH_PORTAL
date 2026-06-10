"use client"
import Image from "next/image"
import Container from "@/components/shared/container"
import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"

export function AboutSection() {
  return (
    <section className="bg-[#F6F4F2] py-20">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            /* Added h-64 (256px) for mobile and lg:h-[500px] for desktop 
     to ensure the image has a physical size to fill. */
            className="relative h-64 w-full overflow-hidden rounded-sm shadow-xl md:h-[400px] lg:h-[600px]"
          >
            <Image
              src="/assets/about-image.png"
              alt="About FCH Catechesis"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>

          {/* Right Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h2 className="font-trajan text-4xl text-[#8b1a1a]">
              ABOUT FCH CATECHESIS
            </h2>

            <p className="font-montserrat text-[18px] leading-relaxed text-gray-800">
              FCH is a national organization committed to advancing
              evangelization and catechesis among individuals and communities
              involved in ministry, leadership, and faith formation at every
              level. Through mentorship, collaboration, education, and advocacy,
              we strive to strengthen and support those who dedicate themselves
              to sharing the Gospel and nurturing lifelong faith development.
            </p>

            <p className="font-montserrat text-[18px] leading-relaxed text-gray-800">
              Rooted in the richness and diversity of the Hispanic/Latino
              community, FCH works to empower leaders, catechists, ministers,
              and families by providing guidance, resources, and opportunities
              for formation that respond to the cultural and spiritual needs of
              the people they serve.
            </p>

            <div className="mt-2">
              <Button className="h-auto rounded-sm bg-[#e6a84d] px-8 py-3 font-montserrat font-semibold text-black transition-colors hover:bg-[#d6983d]">
                More About Us
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
