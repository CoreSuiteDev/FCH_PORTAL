"use client"

import { use } from "react"
import Image from "next/image"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { events, RegistryEvent } from "@/constants/upcoming-events-data"

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = use(params)
  const slug = resolvedParams?.slug

  const event = events.find((e: RegistryEvent) => e.id.toString() === slug)

  if (!event) return <div className="p-8 text-center">Event not found.</div>

  return (
    <div className="mx-auto min-h-screen max-w-6xl p-8">
      <div className="mt-8 grid grid-cols-1 gap-12 md:mt-12 lg:grid-cols-2">
        {/* Left Side: Event Card Design */}
        <Card className="group flex flex-col overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-md">
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col p-8">
            <h1 className="text-3xl font-black">{event.title}</h1>
            <p className="mt-4 text-gray-600">{event.description}</p>
            <div className="mt-6 space-y-3 text-sm text-gray-500">
              <p>
                📅 {event.date} • {event.time}
              </p>
              <p>📍 {event.location}</p>
              <p>👥 Capacity: {event.capacity} seats</p>
            </div>
          </div>
        </Card>

        {/* Right Side: Enhanced Registration Form */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
          {event.status === "Upcoming" ? (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <h2 className="text-2xl font-bold">Register Now</h2>
                <p className="text-sm text-gray-500">
                  Please provide your details below.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    First Name
                  </label>
                  <input
                    className="w-full rounded-xl border p-3"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Last Name
                  </label>
                  <input
                    className="w-full rounded-xl border p-3"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Email Address
                  </label>
                  <input
                    className="w-full rounded-xl border p-3"
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Phone Number
                  </label>
                  <input
                    className="w-full rounded-xl border p-3"
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Number of Attendees
                  </label>
                  <input
                    className="w-full rounded-xl border p-3"
                    type="number"
                    min="1"
                    max="5"
                    defaultValue="1"
                    required
                  />
                </div>
              </div>

              <Button className="w-full rounded-xl bg-primary py-6 text-lg font-bold">
                Confirm Registration
              </Button>
            </form>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-bold text-red-600">
                Registration Closed
              </h2>
              <p className="mt-2 text-gray-500">
                Current status: {event.status}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
