"use client"

import { Card, CardContent } from "@workspace/ui/components/card"
import Image from "next/image"
import Container from "@/components/shared/container"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

interface Event {
  id: string
  date: string
  title: string
  description: string
  location: string
  image: string // Added image field to dynamic data
}

export function UpcomingEvents() {
  const t = useTranslations("home.events")
  const events: Event[] = t.raw("items")

  return (
    <section className="bg-white">
      <Container className="py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16 md:text-left"
        >
          <h2 className="font-trajan text-3xl font-extrabold text-primary md:text-5xl">
            {t("sectionTitle")}
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 bg-green-700 md:mx-0" />
        </motion.div>

        {/* Responsive Grid: 1 column on mobile, 2 on desktop */}
        <div className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-2">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
<<<<<<< HEAD
              <Card className="h-full overflow-hidden border border-primary bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(139,26,26,0.15)]">
                {/* Flex layout that switches from column to row at 'sm' breakpoint */}
                <CardContent className="flex h-full flex-col gap-6 p-5 sm:flex-row sm:p-6">
                  <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-auto sm:w-48">
=======
              <Card className="overflow-hidden border border-primary bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(139,26,26,0.15)]">
                <CardContent className="flex flex-col items-center gap-8 p-6 sm:flex-row">
                  <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-xl sm:w-56">
>>>>>>> 1dd054157d31c1e8a1cbb43b0ff6207a77534ee4
                    <Image
                      src={event.image || `/assets/event-1.jpg`}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 224px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-col justify-center gap-2">
                    <span className="w-fit font-montserrat text-[10px] font-bold tracking-widest text-[#8b1a1a]/70 uppercase">
                      {event.date}
                    </span>
                    <h3 className="font-trajan text-xl leading-tight font-bold text-[#8b1a1a] md:text-2xl">
                      {event.title}
                    </h3>
                    <p className="line-clamp-3 font-montserrat text-sm leading-relaxed text-gray-700">
                      {event.description}
                    </p>
                    <div className="mt-2 flex items-center text-xs font-bold tracking-wider text-green-800 uppercase transition-colors group-hover:text-green-600 md:text-sm">
                      <span className="mr-2 text-base">➤</span>
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
