"use client"

import { use } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { events, RegistryEvent } from "@/constants/upcoming-events-data"

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const t = useTranslations("eventsList.detail")
  const resolvedParams = use(params)
  const slug = resolvedParams?.slug

  const event = events.find((e: RegistryEvent) => e.id.toString() === slug)

  if (!event) {
    return (
      <div className="p-8 text-center text-xl font-bold">Event not found.</div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl p-8">
      <div className="mt-8 grid grid-cols-1 gap-12 md:mt-12 lg:grid-cols-2">
        {/* Left Side: Event Information */}
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
            <p className="mt-4 leading-relaxed text-gray-600">
              {event.description}
            </p>
            <div className="mt-6 space-y-3 text-sm text-gray-500">
              <p>
                📅 {event.date} • {event.time}
              </p>
              <p>📍 {event.location}</p>
              <p>
                👥 {t("labels.capacity")}: {event.capacity} {t("labels.seats")}
              </p>
            </div>
          </div>
        </Card>

        {/* Right Side: Registration Form */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
          {event.status === "Upcoming" ? (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <h2 className="text-2xl font-bold">{t("form.title")}</h2>
                <p className="text-sm text-gray-500">{t("form.subtitle")}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    {t("form.firstName")}
                  </label>
                  <input
                    className="w-full rounded-xl border p-3"
                    placeholder={t("form.placeholders.firstName")}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    {t("form.lastName")}
                  </label>
                  <input
                    className="w-full rounded-xl border p-3"
                    placeholder={t("form.placeholders.lastName")}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    {t("form.email")}
                  </label>
                  <input
                    className="w-full rounded-xl border p-3"
                    type="email"
                    placeholder={t("form.placeholders.email")}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    {t("form.phone")}
                  </label>
                  <input
                    className="w-full rounded-xl border p-3"
                    type="tel"
                    placeholder={t("form.placeholders.phone")}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    {t("form.attendees")}
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
                {t("form.submit")}
              </Button>
            </form>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-bold text-red-600">
                {t("closed.title")}
              </h2>
              <p className="mt-2 text-gray-500">
                {t("closed.statusLabel")} {event.status}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
