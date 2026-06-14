"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@workspace/ui/components/card"
import Container from "@/components/shared/container"
import { useTranslations } from "next-intl"
import Image from "next/image"

const memberImages = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
]

interface BoardMember {
  name: string
  role: string
  bio: string
}

const BoardMembers: React.FC = () => {
  const t = useTranslations("about.board")
  const members: BoardMember[] = t.raw("members")

  return (
    <section className="bg-[#FBF9F8] py-24">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="font-trajan text-3xl font-extrabold text-primary md:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              {/* Card - removed border and added subtle shadow */}
              <Card className="overflow-hidden border-none bg-white p-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                <CardContent className="p-0">
                  {/* Image container - full cover */}
                  <div className="relative h-96 w-full overflow-hidden">
                    <Image
                      width={400}
                      height={400}
                      src={memberImages[index] || ""}
                      alt={member.name}
                      className="top-center h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient overlay for premium feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Text details area */}
                  <div className="p-6 text-center">
                    <h3 className="mb-1 font-trajan text-xl font-extrabold text-primary">
                      {member.name}
                    </h3>
                    <p className="mb-4 font-montserrat text-xs font-semibold tracking-[0.2em] text-[#f5a623] uppercase">
                      {member.role}
                    </p>
                    <p className="text-[14px] leading-relaxed text-gray-500">
                      {member.bio}
                    </p>
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

export default BoardMembers
