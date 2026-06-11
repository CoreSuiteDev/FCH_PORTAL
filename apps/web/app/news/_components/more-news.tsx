import Container from "@/components/shared/container"
import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface NewsData {
  id: number
  title: string
  category: string
  img: string
}

const newsData: NewsData[] = [
  {
    id: 1,
    title: "Global Unity Initiative Launched",
    category: "World",
    img: "https://picsum.photos/id/1011/1200/800",
  },
  {
    id: 2,
    title: "New Scholarship Program Announced",
    category: "Education",
    img: "https://picsum.photos/id/20/1200/800",
  },
  {
    id: 3,
    title: "Community Resilience Awards",
    category: "Local",
    img: "https://picsum.photos/id/180/1200/800",
  },
  {
    id: 4,
    title: "Advancements in Sustainable Energy",
    category: "Technology",
    img: "https://picsum.photos/id/29/1200/800",
  },
]

const MoreNewsSection = () => {
  const featuredNews = newsData[0]

  return (
    <section className="bg-slate-50 py-20">
      <Container className="mx-auto px-6">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h2 className="font-trajan text-4xl font-bold text-[#8b0000]">
            More news
          </h2>

          <p className="mt-2 text-gray-500 italic">
            Latest updates and insights
          </p>
        </div>

        <motion.div
          className="grid auto-rows-[300px] grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {/* Featured Card */}
          {featuredNews && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg md:col-span-2 md:row-span-2"
            >
              <Image
                src={featuredNews.img}
                alt={featuredNews.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8">
                <span className="text-sm font-bold tracking-widest text-amber-500 uppercase">
                  {featuredNews.category}
                </span>

                <h3 className="mt-2 text-3xl leading-tight font-bold text-white">
                  {featuredNews.title}
                </h3>
              </div>
            </motion.div>
          )}

          {/* Standard Cards */}
          {newsData.slice(1).map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl"
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-6">
                <span className="text-[10px] font-bold tracking-widest text-blue-300 uppercase">
                  {item.category}
                </span>

                <h3 className="mt-1 text-lg font-semibold text-white">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}

          {/* Action Cards */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0 },
            }}
            className="flex flex-col gap-4"
          >
            <button className="flex-1 rounded-2xl border-2 border-[#8b0000] bg-white p-6 font-semibold tracking-wider text-[#8b0000] uppercase transition-colors hover:bg-[#8b0000] hover:text-white">
              Vatican RSS
            </button>

            <button className="flex-1 rounded-2xl bg-gray-900 p-6 font-semibold tracking-wider text-white uppercase transition-colors hover:bg-black">
              Sign Up
            </button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}

export default MoreNewsSection
