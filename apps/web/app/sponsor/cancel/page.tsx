"use client"

import React, { Suspense, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle, ArrowLeft } from "lucide-react"

import Container from "@/components/shared/container"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card"
import { api } from "@/lib/api-client"

function CancelContent() {
  const searchParams = useSearchParams()
  const sponsorshipId = searchParams.get("sponsorship_id") || searchParams.get("id")
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    if (sponsorshipId || sessionId) {
      api.post("/payment/sponsorship/cancel", {
        sponsorshipId: sponsorshipId || undefined,
        sessionId: sessionId || undefined,
      }).catch((err) => {
        console.error("Failed to mark sponsorship as canceled:", err)
      })
    }
  }, [sponsorshipId, sessionId])

  return (
    <Card className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border-gray-200 bg-white pt-0 shadow-xl">
      <CardHeader className="bg-rose-50/50 p-8 pb-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Sponsorship Payment Cancelled
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Your payment session has been cancelled and the status has been updated to CANCELED.
        </p>
      </CardHeader>

      <CardContent className="p-8 text-center text-sm text-gray-600 leading-relaxed">
        Your support helps us grow our community. If you changed your mind or experienced technical issues, you can return to our sponsorship plans and try again whenever you are ready.
      </CardContent>

      <CardFooter className="flex gap-3 p-8">
        <Link href="/sponsor" className="w-full">
          <Button className="h-12 w-full bg-rose-800 font-semibold hover:cursor-pointer hover:bg-rose-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sponsorship Tiers
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function SponsorCancelPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] py-16">
      <Container>
        <Suspense
          fallback={
            <div className="py-20 text-center text-gray-500">
              Processing cancellation...
            </div>
          }
        >
          <CancelContent />
        </Suspense>
      </Container>
    </div>
  )
}
