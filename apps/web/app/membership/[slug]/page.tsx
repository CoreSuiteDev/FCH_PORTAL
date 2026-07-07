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

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
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
  CardElement,
  useStripe,
  useElements,
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
  const tp = useTranslations("membership.packages")

  const slug = resolvedParams.slug

  const stripe = useStripe()
  const elements = useElements()

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

    if (!stripe || !elements) {
      toast.error("Stripe is not fully loaded. Please try again.")
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      toast.error("Payment fields are not ready. Please try again.")
      return
    }

    setIsProcessing(true)

    try {
      const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardholderName,
          email: user.email,
        },
      })

      if (stripeError) {
        throw new Error(stripeError.message || "Stripe card validation failed.")
      }

      if (!paymentMethod) {
        throw new Error("Could not process payment method details.")
      }

      await buyPackage({
        packageId: activePackage!.id,
        name: cardholderName,
        email: user.email,
        paymentMethodId: paymentMethod.id,
        userId: user.id,
      })

      toast.success("Subscription completed successfully!")
      setShowSuccessModal(true)
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
                  <Skeleton className="h-10 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
              <Skeleton className="h-11 w-full mt-4" />
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

  // Determine localized properties
  const baseSlug = activePackage.slug.split("-")[0]
  let title = activePackage.name
  let subtitle = activePackage.subTitle || ""
  let description = activePackage.description || ""
  let features = Array.isArray(activePackage.features) ? (activePackage.features as string[]) : []

  try {
    title = tp(`items.${baseSlug}.title`)
    subtitle = tp(`items.${baseSlug}.subtitle`)
    description = tp(`items.${baseSlug}.description`)
    features = tp.raw(`items.${baseSlug}.features`) as string[]
  } catch (e) {
    // fallback to DB if localization fails
  }

  const basePrice = Number(activePackage.price)

  const cycleText =
    activePackage.billingCycle === "MONTHLY" ? t("pricePerMonth") : t("pricePerYear")

  return (
    <div className="min-h-screen bg-[#F6F4F2] px-4 py-16 font-sans text-[#1C1A19]">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.push("/membership")}
          className="group mb-8 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-[#1C1A19]"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          {t("back")}
        </button>

        <div className="grid items-stretch gap-8 md:grid-cols-12">
          <Card className="flex flex-col justify-between border-border/60 bg-card p-4 shadow-sm md:col-span-6">
            <div>
              <CardHeader className="p-4">
                <div className="mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/10"
                  >
                    {t("selectedPackage")}
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-extrabold text-[#2C2927]">
                  {title}
                </CardTitle>
                <CardDescription className="mt-3 text-xs text-[14px] font-semibold">
                  {subtitle}
                </CardDescription>
                <CardDescription className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4">
                <div className="mb-6 flex items-baseline border-y border-border/50 py-4 text-[#1C1A19]">
                  <span className="text-4xl font-extrabold tracking-tight">
                    ${basePrice.toFixed(2)}
                  </span>
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    / {cycleText}
                  </span>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold tracking-wider text-[#2C2927] uppercase">
                    {t("includedFeatures")}
                  </h4>
                  <ul className="space-y-3 text-xs text-muted-foreground">
                    {features.map((feature, index) => (
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
              {t("disclaimer", { cycle: cycleText })}
            </CardFooter>
          </Card>

          <Card className="relative flex flex-col justify-between overflow-hidden border-border/80 bg-card p-4 shadow-lg md:col-span-6">
            <div className="absolute top-0 right-0 left-0 h-1 bg-primary" />

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

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Card Details
                    </Label>
                    <div className="rounded-lg border border-border/80 bg-background/50 p-4">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "12px",
                              color: "#1C1A19",
                              fontFamily: "inherit",
                              "::placeholder": {
                                color: "#8E8C8A",
                              },
                            },
                            invalid: {
                              color: "#EF4444",
                            },
                          },
                        }}
                      />
                    </div>
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
      </div>

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
                  packageName: title,
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
