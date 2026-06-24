"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import Container from "@/components/shared/container"
import { useTranslations } from "next-intl"
import Image from "next/image"

interface BoardMember {
  name: string
  role: string
  bio: string
  image: string
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <Card className="overflow-hidden border-none bg-white p-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                <CardContent className="p-0">
                  <div className="relative h-96 w-full overflow-hidden">
                    {member.image ? (
                      <>
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </>
                    ) : (
                      <Skeleton className="h-full w-full rounded-none" />
                    )}
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="mb-1 font-trajan text-xl font-extrabold text-primary">
                      {member.name}
                    </h3>

                    <p className="mb-4 font-montserrat text-xs font-semibold tracking-[0.1em] text-[#f5a623] uppercase">
                      {member.role}
                    </p>

                    {member.bio && (
                      <p className="text-[14px] leading-relaxed text-gray-500">
                        {member.bio}
                      </p>
                    )}
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
