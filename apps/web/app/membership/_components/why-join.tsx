"use client"
import React from "react"
import { motion } from "framer-motion"
import { Users, TrendingUp, Star, Network } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const features = [
  {
    title: "Community Impact",
    desc: "Connect with a nationwide network of healthcare professionals dedicated to integrating faith-based care into modern clinical practice.",
    icon: Users,
  },
  {
    title: "Ethical Growth",
    desc: "Access exclusive resources on clinical ethics, guiding your professional journey through complex healthcare landscapes with moral clarity.",
    icon: TrendingUp,
  },
  {
    title: "Spiritual Support",
    desc: "Receive daily spiritual briefs and join prayer groups tailored for the unique challenges and triumphs of the medical profession.",
    icon: Star,
  },
  {
    title: "Resources and networking",
    desc: "Access valuable resources, industry insights, and networking opportunities to connect, collaborate, grow professionally, and achieve your goals.",
    icon: Network,
  },
]

export default function WhyJoin() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl text-center">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-2 text-sm font-medium tracking-[0.2em] text-primary uppercase">
            Foundation
          </p>
          <h2 className="mb-16 text-4xl font-semibold text-primary md:text-5xl">
            WHY JOIN FCH CATECHESIS?
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full border-none bg-[#fdfafa] shadow-md transition-shadow hover:shadow-xl">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fce8e8]">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold text-primary">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
