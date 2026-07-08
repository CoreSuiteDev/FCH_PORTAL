"use client"

import React, { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Download, ArrowRight } from "lucide-react"

import Container from "@/components/shared/container"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card"

function ReceiptContent() {
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount") || "0.00"
  const currency = searchParams.get("currency") || "USD"
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="mx-auto w-md overflow-hidden rounded-2xl border-gray-200 bg-white pt-0 shadow-xl md:w-xl lg:w-2xl">
      <CardHeader className="bg-rose-50/50 p-8 pb-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Donation Successful!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Thank you for your generous donation. Your support is greatly appreciated.
        </p>
      </CardHeader>

      <CardContent className="p-8">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Donation Receipt
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-200 pb-4">
              <span className="text-gray-500">Contribution Type</span>
              <span className="font-semibold text-gray-900">General Donation</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-4">
              <span className="text-gray-500">Amount Donated</span>
              <span className="font-semibold text-gray-900">
                {currency === "USD" ? "$" : "€"}
                {amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-semibold text-gray-900">{date}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-8">
        <Button
          variant="outline"
          className="h-12 w-full border-gray-200 text-gray-700 hover:cursor-pointer hover:bg-gray-50"
          onClick={() => window.print()}
        >
          <Download className="mr-2 h-4 w-4" /> Download Receipt
        </Button>
        <Link href="/" className="w-full">
          <Button className="h-12 w-full bg-rose-800 font-semibold hover:cursor-pointer hover:bg-rose-900">
            Return to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] py-16">
      <Container>
        <Suspense
          fallback={
            <div className="py-20 text-center text-gray-500">
              Loading your receipt...
            </div>
          }
        >
          <ReceiptContent />
        </Suspense>
      </Container>
    </div>
  )
}
