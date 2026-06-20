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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { PackageTier, usePackageStore } from "@/store/use-membership-store"
import { MEMBERSHIP_REGISTRY } from "@/constants/membership"
import { useTranslations } from "next-intl"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function PackageDynamicDetailsPage({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params)

  const { selectPackage, billingCycle } = usePackageStore()

  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)

  const t = useTranslations("membership.checkout")
  const tp = useTranslations("membership.packages")

  const slugId = resolvedParams.slug as PackageTier
  const activePackage =
    slugId && MEMBERSHIP_REGISTRY[slugId] ? MEMBERSHIP_REGISTRY[slugId] : null

  const localizedActivePackage = activePackage
    ? {
        ...activePackage,
        title: tp(`items.${activePackage.id}.title`),
        description: tp(`items.${activePackage.id}.description`),
        features: tp.raw(`items.${activePackage.id}.features`) as string[],
      }
    : null

  useEffect(() => {
    if (slugId && MEMBERSHIP_REGISTRY[slugId]) {
      selectPackage(slugId)
    } else {
      router.push("/membership")
    }
  }, [slugId, router, selectPackage])

  const getCalculatedPrice = (price: number) => {
    return billingCycle === "monthly" ? price : Math.round(price * 10)
  }

  const basePrice = activePackage ? getCalculatedPrice(activePackage.price) : 0
  const setupFee = basePrice > 0 ? 5.0 : 0
  const totalInvoiceAmount = basePrice + setupFee

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccessModal(true)
    }, 2000)
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    router.push(`/`)
  }

  if (!localizedActivePackage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F4F2]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const cycleText =
    billingCycle === "monthly" ? t("pricePerMonth") : t("pricePerYear")

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
                  {localizedActivePackage.title}
                </CardTitle>
                <CardDescription className="mt-3 text-xs text-[14px] font-semibold">
                  {localizedActivePackage.subtitle}
                </CardDescription>
                <CardDescription className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {localizedActivePackage.description}
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
                    {localizedActivePackage.features.map((feature, index) => (
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
                      placeholder="John Doe"
                      className="h-10 bg-background/50 text-xs transition-all focus-visible:ring-2 focus-visible:ring-ring/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      {t("cardNumber")}
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
                        {t("expiration")}
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
                        {t("cvc")}
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

                  <div className="mt-6 space-y-2 rounded-xl bg-muted/50 p-4 text-[11px] font-medium text-muted-foreground">
                    <div className="flex justify-between">
                      <span>{t("baseTier")}</span>
                      <span className="text-[#1C1A19]">
                        ${basePrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("processingFee")}</span>
                      <span className="text-[#1C1A19]">
                        ${setupFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border/60 pt-2 font-bold text-[#1C1A19]">
                      <span>{t("totalBillable")}</span>
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
                      t("completeCheckout", {
                        amount: totalInvoiceAmount.toFixed(2),
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
                  packageName: localizedActivePackage.title,
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
