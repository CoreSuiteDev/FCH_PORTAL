"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@workspace/ui/components/card"
import Container from "@/components/shared/container"

const OurProfessionalApproach: React.FC = () => {
  const [row1Active, setRow1Active] = useState<number | null>(null)
  const [row2Active, setRow2Active] = useState<number | null>(null)

  const transitionConfig = {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  }

  return (
    <section className="overflow-hidden bg-[#FBF9F8] py-8 md:py-16">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-semibold text-red-700">
            Our Professional Approach
          </h2>
          <div className="mx-auto mb-6 h-1 w-20 bg-[#f5a623]" />
          <p className="font-semisemibold text-[14px]">
            A holistic methodology combining tradition with modern professional
            standards.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Row 1 */}
          <div
            className="flex h-auto flex-col gap-6 md:h-[180px] md:flex-row"
            onMouseLeave={() => setRow1Active(null)}
          >
            {/* Card 1 */}
            <motion.div
              animate={{
                flex: (row1Active === null ? true : row1Active === 0) ? 2 : 1,
              }}
              transition={transitionConfig}
              onMouseEnter={() => setRow1Active(0)}
              className="h-auto overflow-hidden bg-white md:h-[180px]"
            >
              <Card className="h-full rounded-none border-none bg-transparent p-8 shadow-none">
                <CardContent className="max-w-2xl p-0">
                  {" "}
                  {/* Added max-w-2xl */}
                  <h3 className="mb-4 text-2xl font-semibold text-red-700">
                    Theological Foundations
                  </h3>
                  <p className="leading-relaxed opacity-90">
                    We ground our work in sound theological study, ensuring that
                    all catechetical leaders are well-equipped with the
                    intellectual tools required for teaching the faith.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              animate={{ flex: row1Active === 1 ? 2 : 1 }}
              transition={transitionConfig}
              onMouseEnter={() => setRow1Active(1)}
              className="h-auto overflow-hidden bg-white md:h-[180px]"
            >
              <Card className="h-full rounded-none border-none bg-transparent p-8 shadow-none">
                <CardContent className="max-w-2xl p-0">
                  {" "}
                  {/* Added max-w-2xl */}
                  <h3 className="mb-4 text-2xl font-semibold text-red-700">
                    Cultural Competency
                  </h3>
                  <p className="leading-relaxed opacity-90">
                    Bridging languages and traditions with grace.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Row 2 */}
          <div
            className="flex h-auto flex-col gap-6 md:h-[180px] md:flex-row"
            onMouseLeave={() => setRow2Active(null)}
          >
            {/* Card 3 */}
            <motion.div
              animate={{ flex: row2Active === 0 ? 2 : 1 }}
              transition={transitionConfig}
              onMouseEnter={() => setRow2Active(0)}
              className="h-auto overflow-hidden bg-white md:h-[180px]"
            >
              <Card className="h-full rounded-none! border-none bg-transparent p-8 shadow-none">
                <CardContent className="max-w-2xl p-0">
                  {" "}
                  {/* Added max-w-2xl */}
                  <h3 className="mb-4 text-2xl font-semibold text-red-700">
                    Leadership Development
                  </h3>
                  <p className="leading-relaxed opacity-90">
                    Fostering administrative skills and strategic planning for
                    church organizations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              animate={{
                flex: (row2Active === null ? true : row2Active === 1) ? 2 : 1,
              }}
              transition={transitionConfig}
              onMouseEnter={() => setRow2Active(1)}
              className="h-auto overflow-hidden bg-[#B82A32] text-white md:h-[180px]"
            >
              <Card className="h-full border-none bg-transparent p-8 shadow-none">
                <CardContent className="max-w-2xl p-0">
                  {" "}
                  {/* Added max-w-2xl */}
                  <h3 className="mb-4 text-2xl font-semibold text-white">
                    Spiritual Growth
                  </h3>
                  <p className="leading-relaxed text-white opacity-90">
                    Formation isn't just professional; it's personal. We provide
                    retreats and spiritual direction tailored for the needs of
                    those in high-intensity ministry roles.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default OurProfessionalApproach
