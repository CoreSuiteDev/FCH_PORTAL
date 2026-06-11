"use client"
import { Card, CardContent } from "@workspace/ui/components/card"
import Image from "next/image"
import Container from "@/components/shared/container"
import { motion } from "framer-motion"
import { events } from "@/constants/upcoming-events-data"

export function UpcomingEvents() {
  return (
    <section className="bg-white">
      <Container className="py-20">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center md:text-left"
        >
          <h2 className="font-trajan text-5xl tracking-wide text-[#8b1a1a]">
            UPCOMING EVENTS
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 bg-green-700 md:mx-0" />
        </motion.div>

        {/* Grid Container */}
        <div className="grid gap-10 md:grid-cols-2">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -8 }} // Lift effect
              className="group"
            >
              <Card className="overflow-hidden border border-primary bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(139,26,26,0.15)]">
                <CardContent className="flex flex-col items-center gap-8 p-6 sm:flex-row">
                  {/* Image Container with zoom effect */}
                  <div className="relative h-56 w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-56">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-col gap-3">
                    <span className="w-fit font-montserrat text-xs font-bold tracking-widest text-[#8b1a1a]/70 uppercase">
                      {event.date}
                    </span>
                    <h3 className="font-trajan text-2xl leading-tight font-bold text-[#8b1a1a]">
                      {event.title}
                    </h3>
                    <p className="font-montserrat text-[13px] leading-relaxed text-gray-700">
                      {event.description}
                    </p>
                    <div className="mt-2 flex items-center text-sm font-bold tracking-wider text-green-800 uppercase transition-colors group-hover:text-green-600">
                      <span className="mr-2 text-lg">➤</span>
                      {event.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
