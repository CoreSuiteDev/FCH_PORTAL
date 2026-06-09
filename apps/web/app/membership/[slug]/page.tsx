"use client"

import React, { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import {
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Loader2,
  Check,
  CheckCircle2,
} from "lucide-react"

// Shadcn UI Primitive Component Imports
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import {
  PackageTier,
  usePackageStore,
} from "@/store/use-membership-store"
import { MEMBERSHIP_REGISTRY } from "@/constents/membership"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function PackageDynamicDetailsPage({ params }: PageProps) {
  const router = useRouter()

  // Unwrap modern promise-based routing params parameters safely via React.use()
  const resolvedParams = use(params)
  const selectPackage = usePackageStore((state) => state.selectPackage)

  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)

  const slugId = resolvedParams.slug as PackageTier
  const activePackage = (slugId && MEMBERSHIP_REGISTRY[slugId]) ? MEMBERSHIP_REGISTRY[slugId] : null

  useEffect(() => {
    if (slugId && MEMBERSHIP_REGISTRY[slugId]) {
      selectPackage(slugId) // Keep state synchronized with layout actions
    } else {
      // Direct unexpected or invalid parameters back to baseline catalog overview
      router.push("/membership")
    }
  }, [slugId, router, selectPackage])

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate standard asynchronous merchant checkout delay intervals
    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccessModal(true)
    }, 2000)
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    // router.push(`/dashboard/${activePackage?.id}`)
    router.push(`/`)
  }

  if (!activePackage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F4F2]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const basePrice = activePackage.price
  const setupFee = basePrice > 0 ? 5.0 : 0
  const totalInvoiceAmount = basePrice + setupFee

  return (
    <div className="min-h-screen bg-[#F6F4F2] px-4 py-16 font-sans text-[#1C1A19]">
      <div className="mx-auto max-w-5xl">
        {/* Navigation Return Utility Hook */}
        <button
          onClick={() => router.push("/membership")}
          className="group mb-8 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-[#1C1A19]"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to Pricing Registry
        </button>

        {/* Checkout Split Column Layout Grid */}
        <div className="grid items-stretch gap-8 md:grid-cols-12">
          {/* LEFT COLUMN: Core Membership Value Specs Ledger */}
          <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-sm md:col-span-6">
            <div>
              <CardHeader className="p-4">
                <div className="mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/10"
                  >
                    Selected Configuration Package
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-extrabold text-[#2C2927]">
                  {activePackage.title}
                </CardTitle>
                <CardDescription className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {activePackage.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4">
                {/* Financial Overview Metric Context */}
                <div className="mb-6 flex items-baseline border-y border-border/50 py-4 text-[#1C1A19]">
                  <span className="text-4xl font-extrabold tracking-tight">
                    ${activePackage.price}
                  </span>
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    / {activePackage.billingPeriod}
                  </span>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold tracking-wider text-[#2C2927] uppercase">
                    Included Core Features:
                  </h4>
                  <ul className="space-y-3 text-xs text-muted-foreground">
                    {activePackage.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check size={10} strokeWidth={3} />
                        </span>
                        <span className="leading-normal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </div>

            <CardFooter className="border-t border-border/40 p-4 pt-4 text-[11px] text-muted-foreground">
              You are selecting a system layout model. Upon payment activation,
              access control rules will pass modifications down to your account
              payload structure.
            </CardFooter>
          </Card>

          {/* RIGHT COLUMN: Interactive Gateway Form Card */}
          <Card className="relative flex flex-col justify-between overflow-hidden border-border/80 bg-card p-4 shadow-lg md:col-span-6">
            <div className="absolute top-0 right-0 left-0 h-1 bg-primary" />

            <div>
              <CardHeader className="flex flex-row items-center gap-2.5 space-y-0 border-b border-border/60 p-4 pb-4">
                <CreditCard className="text-primary" size={18} />
                <CardTitle className="text-md font-bold text-[#2C2927]">
                  Payment Gateway Integration
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-6">
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Cardholder Name
                    </Label>
                    <Input
                      required
                      type="text"
                      disabled={isProcessing}
                      placeholder="John Doe"
                      className="h-10 bg-background/50 text-xs transition-all focus-visible:ring-2 focus-visible:ring-ring/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Card Number
                    </Label>
                    <Input
                      required
                      type="text"
                      maxLength={16}
                      disabled={isProcessing}
                      placeholder="4111 2222 3333 4444"
                      className="h-10 bg-background/50 text-xs transition-all focus-visible:ring-2 focus-visible:ring-ring/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                        Expiration
                      </Label>
                      <Input
                        required
                        type="text"
                        disabled={isProcessing}
                        placeholder="MM / YY"
                        className="h-10 bg-background/50 text-xs transition-all focus-visible:ring-2 focus-visible:ring-ring/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                        CVC
                      </Label>
                      <Input
                        required
                        type="password"
                        maxLength={3}
                        disabled={isProcessing}
                        placeholder="•••"
                        className="h-10 bg-background/50 text-xs transition-all focus-visible:ring-2 focus-visible:ring-ring/20"
                      />
                    </div>
                  </div>

                  {/* Pricing Breakdown Card Fragment */}
                  <div className="mt-6 space-y-2 rounded-xl bg-muted/50 p-4 text-[11px] font-medium text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Base Tier Access:</span>
                      <span className="text-[#1C1A19]">
                        ${basePrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing / Setup Fee:</span>
                      <span className="text-[#1C1A19]">
                        ${setupFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border/60 pt-2 font-bold text-[#1C1A19]">
                      <span>Total Billable Amount:</span>
                      <span className="text-sm font-extrabold text-primary">
                        ${totalInvoiceAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="mt-2 h-11 w-full cursor-pointer font-bold shadow-md shadow-primary/10 transition-all active:scale-[0.99]"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `Complete Checkout: $${totalInvoiceAmount.toFixed(2)}`
                    )}
                  </Button>
                </form>
              </CardContent>
            </div>

            <CardFooter className="flex items-center justify-center gap-1.5 p-4 pt-2 text-[10px] font-medium text-muted-foreground/80">
              <ShieldCheck size={13} className="text-emerald-600" />
              Secure Tokenized Subscription Node Validation.
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* DYNAMIC BACKDROP SUCCESS MODAL POPUP */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 py-4 backdrop-blur-sm duration-200 fade-in">
          <Card className="w-full max-w-md scale-100 transform animate-in rounded-2xl border-border/40 bg-card p-6 text-center shadow-2xl transition-all duration-300 zoom-in-95">
            <CardHeader className="flex flex-col items-center p-0">
              <div className="mb-4 flex h-14 w-14 animate-bounce items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-inner">
                <CheckCircle2 size={32} />
              </div>
              <CardTitle className="text-2xl font-extrabold text-[#2C2927]">
                Payment Successful!
              </CardTitle>
              <CardDescription className="mt-2 px-2 text-sm leading-relaxed text-muted-foreground">
                You have successfully unlocked access to the{" "}
                <strong className="font-semibold text-[#1C1A19]">
                  {activePackage.title}
                </strong>{" "}
                tier workspace environment.
              </CardDescription>
            </CardHeader>

            <CardFooter className="mt-6 p-0">
              <Button
                onClick={handleModalClose}
                className="mb-3 h-11 w-full cursor-pointer font-bold shadow-md shadow-primary/20 transition-all active:scale-[0.99]"
              >
                Go to Workspace Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
