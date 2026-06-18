"use client"

import React, { useEffect, useState } from "react"
import { getEvents } from "@/services/event-service" // আপনার সার্ভিস ফাইল ইমপোর্ট করুন

const DisplayEvents = () => {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const data = await getEvents()
        setEvents(data)
      } catch (err) {
        setError("ইভেন্ট লোড করতে সমস্যা হয়েছে")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Upcoming Events</h1>
      <div className="grid gap-4">
        {events.map((event: any) => (
          <div key={event._id} className="rounded-lg border p-4 shadow">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">{event.description}</p>
            <div className="mt-2 text-sm">
              <p>Location: {event.location}</p>
              <p>Visibility: {event.visibility}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DisplayEvents
