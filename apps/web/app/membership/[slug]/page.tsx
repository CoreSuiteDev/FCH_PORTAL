"use client"

import React, { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Container from "@/components/shared/container"
import {
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "@workspace/ui/components/sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
} from "@stripe/react-stripe-js"

import { usePackageStore } from "@/store/use-membership-store"
import { usePackageBySlug, useBuyPackage } from "@/hooks/usePackage"
import { useTranslations } from "next-intl"
import { authClient } from "@/lib/auth"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
)

interface PageProps {
  params: Promise<{ slug: string }>
}

function PackageDynamicDetailsForm({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params)

  const { selectPackage } = usePackageStore()

  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [cardholderName, setCardholderName] = useState<string>("")

  const t = useTranslations("membership.checkout")


  const slug = resolvedParams.slug

  const { data: session } = authClient.useSession()
  const user = session?.user

  const { data: activePackage, isLoading, isError } = usePackageBySlug(slug)
  const { mutateAsync: buyPackage } = useBuyPackage()

  useEffect(() => {
    if (activePackage) {
      selectPackage(activePackage.slug)
    }
  }, [activePackage, selectPackage])

  useEffect(() => {
    if (user) {
      setCardholderName(user.name || "")
    }
  }, [user])

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load membership package. Redirecting...")
      router.push("/membership")
    }
  }, [isError, router])

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("You must be logged in to purchase a membership package.")
      router.push("/login")
      return
    }

    setIsProcessing(true)

    try {
      const res = await buyPackage({
        packageId: activePackage!.id,
        name: cardholderName,
        email: user.email,
        paymentMethodId: "",
        userId: user.id,
      })

      if (res && res.checkoutUrl) {
        window.location.href = res.checkoutUrl
      } else {
        throw new Error("Failed to initiate secure checkout redirect.")
      }
    } catch (err: any) {
      console.error("Subscription payment error:", err)
      toast.error(err.message || "Failed to complete subscription purchase.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/"
    window.location.href = portalUrl
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F4F2] px-4 py-16 font-sans text-[#1C1A19]">
        <div className="mx-auto max-w-5xl">
          <Skeleton className="h-5 w-24 mb-8" />
          <div className="grid items-stretch gap-8 md:grid-cols-12">
            <div className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-8 shadow-sm md:col-span-6 h-[500px]">
              <div>
                <Skeleton className="h-5 w-32 rounded-full mb-4" />
                <Skeleton className="h-10 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-16 w-full mb-6" />
                <Skeleton className="h-12 w-28 mb-6" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-8 shadow-lg md:col-span-6 h-[500px]">
              <div>
                <Skeleton className="h-6 w-1/3 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!activePackage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F4F2]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const basePrice = Number(activePackage.price)
  const pkgCycleFormatted = activePackage.billingCycle === "MONTHLY" ? "mo" : "yr"

  return (
    <div className="min-h-screen bg-[#F6F4F2] px-4 py-16 font-sans text-[#1C1A19]">
      <Container className="max-w-5xl">
        <Link
          href="/membership"
          className="mb-8 flex items-center text-xs font-bold tracking-wider text-muted-foreground transition-colors hover:text-[#1C1A19] uppercase"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("back")}
        </Link>

        <div className="grid items-stretch gap-8 md:grid-cols-12">
          {/* Left Side: Summary Card */}
          <Card className="flex flex-col justify-between rounded-2xl border-border/60 bg-card p-8 shadow-sm md:col-span-6">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-wider text-primary uppercase">
                {t("checkoutSummary")}
              </span>
              <CardHeader className="p-0 pt-4">
                <CardTitle className="text-3xl font-extrabold text-[#2C2927]">
                  {activePackage?.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {activePackage?.subTitle || "Exclusive package tier access"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 py-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {activePackage?.description ||
                    "Gain exclusive privilege benefits, resources access, event opportunities."}
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-primary">
                    ${basePrice}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    /{pkgCycleFormatted}
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Right Side: Payment Form */}
          <Card className="flex flex-col justify-between rounded-2xl border-border/80 bg-card shadow-lg md:col-span-6">
            <div>
              <CardHeader className="flex flex-row items-center gap-2.5 space-y-0 border-b border-border/60 p-4 pb-4">
                <CreditCard className="text-primary" size={18} />
                <CardTitle className="text-md font-bold text-[#2C2927]">
                  {t("gateway")}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-6">
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      {t("cardholder")}
                    </Label>
                    <Input
                      required
                      type="text"
                      disabled={isProcessing}
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="John Doe"
                      className="h-10 bg-background/50 text-xs transition-all focus-visible:ring-2 focus-visible:ring-ring/20"
                    />
                  </div>

                  <div className="mt-6 space-y-2 rounded-xl bg-muted/50 p-4 text-[11px] font-medium text-muted-foreground">
                    <div className="flex justify-between">
                      <span>{t("baseTier")}</span>
                      <span className="text-[#1C1A19]">
                        ${basePrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border/60 pt-2 font-bold text-[#1C1A19]">
                      <span>{t("totalBillable")}</span>
                      <span className="text-sm font-extrabold text-primary">
                        ${basePrice.toFixed(2)}
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
                      t("completeCheckout", {
                        amount: basePrice.toFixed(2),
                      })
                    )}
                  </Button>
                </form>
              </CardContent>
            </div>

            <CardFooter className="flex items-center justify-center gap-1.5 p-4 pt-2 text-[10px] font-medium text-muted-foreground/80">
              <ShieldCheck size={13} className="text-emerald-600" />
              {t("secureToken")}
            </CardFooter>
          </Card>
        </div>
      </Container>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 py-4 backdrop-blur-sm duration-200 fade-in">
          <Card className="w-full max-w-md scale-100 transform animate-in rounded-2xl border-border/40 bg-card p-6 text-center shadow-2xl transition-all duration-300 zoom-in-95">
            <CardHeader className="flex flex-col items-center p-0">
              <div className="mb-4 flex h-14 w-14 animate-bounce items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-inner">
                <CheckCircle2 size={32} />
              </div>
              <CardTitle className="text-2xl font-extrabold text-[#2C2927]">
                {t("successTitle")}
              </CardTitle>
              <CardDescription className="mt-2 px-2 text-sm leading-relaxed text-muted-foreground">
                {t("successDesc", {
                  packageName: activePackage?.name || "Membership Package",
                })}
              </CardDescription>
            </CardHeader>

            <CardFooter className="mt-6 p-0">
              <Button
                onClick={handleModalClose}
                className="mb-3 h-11 w-full cursor-pointer font-bold shadow-md shadow-primary/20 transition-all active:scale-[0.99]"
              >
                {t("goToDashboard")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function PackageDynamicDetailsPage({ params }: PageProps) {
  return (
    <Elements stripe={stripePromise}>
      <PackageDynamicDetailsForm params={params} />
    </Elements>
  )
}
