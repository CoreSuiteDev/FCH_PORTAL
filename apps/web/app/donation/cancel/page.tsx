"use client"

import React from "react"
import Link from "next/link"
import { AlertCircle, ArrowLeft } from "lucide-react"

import Container from "@/components/shared/container"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card"

export default function DonationCancelPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] py-16">
      <Container>
        <Card className="mx-auto w-md overflow-hidden rounded-2xl border-gray-200 bg-white pt-0 shadow-xl md:w-xl lg:w-2xl">
          <CardHeader className="bg-rose-50/50 p-8 pb-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Donation Cancelled
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your payment session has been cancelled. No charges were made.
            </p>
          </CardHeader>

          <CardContent className="p-8 text-center text-sm text-gray-600 leading-relaxed">
            If you experienced technical difficulties or encountered an issue, please try again or contact our support team.
          </CardContent>

          <CardFooter className="flex gap-3 p-8">
            <Link href="/donation/100" className="w-full">
              <Button className="h-12 w-full bg-rose-800 font-semibold hover:cursor-pointer hover:bg-rose-900">
                <ArrowLeft className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </Container>
    </div>
  )
}
