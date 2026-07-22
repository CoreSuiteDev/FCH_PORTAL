"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
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
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null)

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
              className="group flex cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <Card className="flex h-full w-full flex-col overflow-hidden border-none bg-white p-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                <CardContent className="flex flex-1 flex-col p-0">
                  <div className="relative h-80 w-full shrink-0 overflow-hidden">
                    {member.image ? (
                      <>
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                      </>
                    ) : (
                      <Skeleton className="h-full w-full rounded-none" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 text-center">
                    <div>
                      <h3 className="mb-1 font-trajan text-xl font-extrabold text-primary">
                        {member.name}
                      </h3>

                      <p className="mb-4 font-montserrat text-xs font-semibold tracking-[0.1em] text-[#f5a623] uppercase">
                        {member.role}
                      </p>

                      {member.bio ? (
                        <p className="line-clamp-2 text-left text-[14px] leading-relaxed text-gray-500">
                          {member.bio}
                        </p>
                      ) : null}
                    </div>

                    {member.bio ? (
                      <div className="mt-4 text-left font-montserrat text-xs font-bold text-primary transition-colors ">
                        Read Full Bio &rarr;
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Modal Dialog to show full bio */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      >
        {selectedMember && (
          <DialogContent className="flex max-h-[85vh] w-full min-w-4xl flex-col overflow-hidden p-0">
            {/* Fixed header */}
            <DialogHeader className="shrink-0 border-b border-gray-100 p-6 pb-4">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {selectedMember.image ? (
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl shadow-md">
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                ) : null}
                <div>
                  <DialogTitle className="font-trajan text-2xl font-extrabold text-primary md:text-3xl">
                    {selectedMember.name}
                  </DialogTitle>
                  <p className="mt-1.5 font-montserrat text-xs font-semibold tracking-[0.1em] text-[#f5a623] uppercase">
                    {selectedMember.role}
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* Scrollable bio */}
            {selectedMember.bio ? (
              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4"
                data-lenis-prevent
              >
                <div className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                  {selectedMember.bio}
                </div>
              </div>
            ) : null}
          </DialogContent>
        )}
      </Dialog>
    </section>
  )
}

export default BoardMembers
