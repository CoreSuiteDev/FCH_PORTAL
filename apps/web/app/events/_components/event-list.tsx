"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { events, EventStatus } from "@/constants/upcoming-events-data"
import Container from "@/components/shared/container"

export default function EventsList() {
  const [activeTab, setActiveTab] = useState<EventStatus>("Upcoming")

  const upcomingEvents = events.filter((e) => e.status === "Upcoming")
  const heroEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null

  return (
    <section className="bg-white">
      <Container className="p-8">
        {/* Hero Banner */}
        {heroEvent && (
          <section className="relative mb-12 flex h-[400px] flex-col justify-end overflow-hidden rounded-3xl p-12 text-white">
            <Image
              src={heroEvent.image}
              alt={heroEvent.title}
              fill
              className="absolute inset-0 object-cover brightness-50"
              priority
            />
            <div className="relative z-10">
              <span className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-semibold backdrop-blur-md">
                Featured Event
              </span>
              <h1 className="text-5xl font-bold">{heroEvent.title}</h1>
              <p className="mt-2 max-w-xl text-lg text-gray-200">
                {heroEvent.description}
              </p>
              <Link href={`/events/${heroEvent.id}`}>
                <Button className="mt-6 w-fit rounded-full bg-white px-8 text-black hover:bg-gray-200">
                  Register Now
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* Premium Pill-Shaped Tabs */}
        <Tabs
          defaultValue="Upcoming"
          onValueChange={(v) => setActiveTab(v as EventStatus)}
          className="w-full"
        >
          <div className="mb-12 flex justify-center">
            <TabsList className="h-14 w-full max-w-md items-center rounded-full border border-gray-200 bg-gray-50/50 p-1.5 shadow-inner">
              {(["Upcoming", "Ongoing", "Ended"] as EventStatus[]).map(
                (status) => (
                  <TabsTrigger
                    key={status}
                    value={status}
                    className="h-full flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    {status}
                  </TabsTrigger>
                )
              )}
            </TabsList>
          </div>

          {(["Upcoming", "Ongoing", "Ended"] as EventStatus[]).map((status) => (
            <TabsContent
              key={status}
              value={status}
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              {events
                .filter((e) => e.status === status)
                .slice(0, 3)
                .map((item) => (
                  <Card
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl leading-tight font-bold">
                        {item.title}
                      </h3>
                      <div className="mt-4 flex-1 space-y-3 text-sm text-gray-600">
                        <p>
                          📅 {item.date} • {item.time}
                        </p>
                        <p>📍 {item.location}</p>
                        <p>👥 Capacity: {item.capacity}</p>
                      </div>
                      <Link href={`/events/${item.id}`} className="mt-6">
                        <Button
                          variant="outline"
                          className="w-full rounded-xl border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </Container>
    </section>
  )
}
