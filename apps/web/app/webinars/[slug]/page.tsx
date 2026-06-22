"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import { useTranslations } from "next-intl"
import { Calendar, MapPin, Users } from "lucide-react"

export interface Webinar {
  id: string
  title: string
  description: string
  date: string
  location: string
  capacity: string
  image: string
  isClosed?: boolean
}

export default function WebinarDetails() {
  const t = useTranslations("eventsList.detail")
  const tPage = useTranslations("webinarsPage")

  const { slug } = useParams() as { slug: string }

  const allWebinars: Webinar[] = tPage.raw("upcoming.items")
  const webinar: Webinar | undefined = allWebinars.find(
    (item: Webinar) => item.id === slug
  )

  if (!webinar) {
    return (
      <div className="flex h-96 items-center justify-center text-xl text-gray-500">
        Webinar not found.
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col gap-12 md:flex-row md:items-stretch">
        {/* Webinar Info Card */}
        <div className="flex-1 rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
          <div className="relative mb-6 h-[300px] w-full">
            <Image
              src={webinar.image}
              alt={webinar.title}
              fill
              className="rounded-3xl object-cover"
            />
          </div>
          <h1 className="mb-4 font-trajan text-4xl font-bold text-primary">
            {webinar.title}
          </h1>
          <p className="text-gray-600">{webinar.description}</p>

          <div className="mt-6 space-y-3 text-sm">
            <p className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-4 w-4 text-primary" /> {webinar.date}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-primary" /> {webinar.location}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <Users className="h-4 w-4 text-primary" /> Capacity:{" "}
              {webinar.capacity} seats
            </p>
          </div>
        </div>

        {/* Form/Status Card */}
        <div className="flex flex-1 flex-col rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
          {webinar.isClosed ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <h2 className="text-2xl font-bold text-red-600">
                {t("closed.title")}
              </h2>
              <p className="mt-2 text-gray-500">{t("closed.statusLabel")}</p>
            </div>
          ) : (
            <form
              className="flex h-full flex-col space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
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

              <div className="flex-grow space-y-4">
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
          )}
        </div>
      </div>
    </div>
  )
}
