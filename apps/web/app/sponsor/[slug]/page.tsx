"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import Container from "@/components/shared/container"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  ArrowLeft,
  CreditCard,
  Check,
  Loader2,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@workspace/ui/components/card"

export default function TierDetails() {
  const params = useParams()
  const slug = params.slug as string
  const t = useTranslations("sponsorship")

  const tiers = t.raw("tiers.items") as any[]
  const tier = tiers?.find((item) => item.id === slug)

  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  })

  if (!tier) return null

  const basePrice = parseFloat(tier.price.replace(/[^0-9.-]+/g, ""))
  const setupFee = 5.0
  const totalAmount = basePrice + setupFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "number") {
      const sanitized = value.replace(/\D/g, "").slice(0, 16)
      setFormData((prev) => ({ ...prev, number: sanitized }))
    } else if (name === "expiry") {
      let sanitized = value.replace(/\D/g, "")
      if (sanitized.length > 4) sanitized = sanitized.slice(0, 4)

      let formatted = sanitized
      if (sanitized.length > 2) {
        formatted = `${sanitized.slice(0, 2)}/${sanitized.slice(2)}`
      }
      setFormData((prev) => ({ ...prev, expiry: formatted }))
    } else if (name === "cvc") {
      const sanitized = value.replace(/\D/g, "").slice(0, 3)
      setFormData((prev) => ({ ...prev, cvc: sanitized }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.number.length !== 16 ||
      formData.expiry.length !== 5 ||
      formData.cvc.length !== 3 ||
      !formData.name
    ) {
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowSuccessModal(true)
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-16">
      <Container className="max-w-5xl">
        <Link
          href="/sponsorship"
          className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pricing Registry
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
            <CardContent className="p-8">
              <span className="inline-block rounded-md bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-800">
                Selected Configuration Package
              </span>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                {tier.title}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {tier.description}
              </p>

              <div className="mt-8">
                <span className="text-4xl font-bold text-gray-900">
                  {tier.price}
                </span>
                <span className="ml-2 text-gray-500">/ {tier.period}</span>
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Included Core Features:
                </p>
                {tier.features?.map((feat: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-rose-500" />
                    <span className="text-sm text-gray-700">{feat}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
                You are subscribing to the {tier.period} plan. Upon payment,
                access control rules will be applied to your account.
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
            <div className="flex items-center gap-3 border-b border-gray-100 p-6">
              <CreditCard className="h-5 w-5 text-rose-900" />
              <h2 className="font-semibold text-gray-900">
                {t("paymentForm.gatewayTitle")}
              </h2>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Cardholder Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-10 border-gray-200"
                    placeholder="John Doe"
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Card Number
                  </label>
                  <Input
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="h-10 border-gray-200"
                    placeholder="4111222233334444"
                    disabled={isProcessing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Expiration
                    </label>
                    <Input
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      className="h-10 border-gray-200"
                      placeholder="MM/YY"
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      CVC
                    </label>
                    <Input
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      className="h-10 border-gray-200"
                      placeholder="123"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3 rounded-lg border border-gray-100 p-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Tier Access:</span>
                    <span>{tier.price}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Processing / Setup Fee:</span>
                    <span>${setupFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 font-bold text-gray-900">
                    <span>Total Billable Amount:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full bg-rose-800 text-base font-semibold hover:bg-rose-900"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    `Complete Checkout: $${totalAmount.toFixed(2)}`
                  )}
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-500">
                <ShieldCheck size={14} /> Secure Tokenized Subscription Node
                Validation.
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Check size={32} />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              Payment Successful!
            </h3>
            <p className="mt-2 text-gray-500">
              Your {tier.title} subscription is now active.
            </p>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="mt-8 w-full bg-gray-900"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
