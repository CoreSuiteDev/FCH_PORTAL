"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import {
  ArrowLeft,
  Check,
  Loader2,
  ShieldCheck,
  User,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import Container from "@/components/shared/container"
import {
  useCreateSponsorship,
  useSponsorPlanById,
} from "@/hooks/useSponsorPlan"
import { authClient } from "@/lib/auth"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
)

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name is required (at least 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
})

type PersonalInfoValues = z.infer<typeof personalInfoSchema>

export default function TierDetailsPage() {
  return (
    <Elements stripe={stripePromise}>
      <TierDetails />
    </Elements>
  )
}

function TierDetails() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()

  // Session
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id

  // Fetch plan details
  const { data: dbTier, isLoading } = useSponsorPlanById(slug)

  // Submit sponsorship mutation
  const { mutateAsync: createSponsorship, isPending: isMutating } =
    useCreateSponsorship()

  const [stripeError, setStripeError] = useState<string | null>(null)

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  const user = session?.user

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: (user as any).phone || "",
      })
    }
  }, [user, reset])

  // Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] py-16">
        <Container className="max-w-5xl">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/sponsor">Sponsor</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Loading...</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="animate-pulse space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-none">
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="h-8 w-2/3 rounded bg-gray-200" />
              <div className="h-20 w-full rounded bg-gray-200" />
            </Card>
            <Card className="animate-pulse space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-none">
              <div className="h-6 w-1/2 rounded bg-gray-200" />
              <div className="h-10 w-full rounded bg-gray-200" />
              <div className="h-10 w-full rounded bg-gray-200" />
            </Card>
          </div>
        </Container>
      </div>
    )
  }

  const tier = dbTier
    ? {
        id: dbTier.id,
        title: dbTier.planName,
        price: `${dbTier.currency === "USD" ? "$" : "€"}${dbTier.amount.toLocaleString()}`,
        period: "1 Year",
        description: dbTier.description || "",
        features: Array.isArray(dbTier.benefits) ? dbTier.benefits : [],
      }
    : null

  if (!tier) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9f9f9] py-16">
        <Container className="max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ArrowLeft size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Sponsor Plan Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            The sponsorship tier you are looking for does not exist or has been
            removed.
          </p>
          <Link href="/sponsor" className="mt-6 inline-block">
            <Button className="rounded-lg bg-gray-900 px-6 py-2 font-medium text-white hover:cursor-pointer hover:bg-gray-800">
              Back to Sponsorship
            </Button>
          </Link>
        </Container>
      </div>
    )
  }

  const basePrice = dbTier
    ? dbTier.amount
    : parseFloat(tier.price.replace(/[^0-9.-]+/g, ""))
  const setupFee = 0
  const totalAmount = basePrice + setupFee

  const handlePaymentSubmit = async (data: PersonalInfoValues) => {
    setStripeError(null)

    try {
      const res = await createSponsorship({
        amount: basePrice,
        currency: dbTier?.currency || "USD",
        tier: dbTier?.tier || "BRONZE",
        description: `Sponsorship for ${dbTier?.planName || tier.title}`,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        paymentMethodId: "",
        userId: userId || undefined,
      })

      if (res && res.checkoutUrl) {
        window.location.href = res.checkoutUrl
      } else {
        throw new Error("Failed to initiate secure checkout redirect.")
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStripeError(err.message)
      } else {
        setStripeError("An unexpected error occurred during checkout.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-16">
      <Container className="max-w-5xl">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/sponsor">Sponsor</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tier.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column: Plan Details */}
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
            </CardContent>
          </Card>

          {/* Right Column: Single Step Form */}
          <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
            <div className="flex items-center gap-3 border-b border-gray-100 p-6">
              <User className="h-5 w-5 text-rose-900" />
              <h2 className="font-semibold text-gray-900">
                Sponsorship Details
              </h2>
            </div>

            <CardContent className="p-6">
              <form
                onSubmit={handleSubmit(handlePaymentSubmit)}
                className="space-y-4"
              >
                <Field data-invalid={!!errors.name}>
                  <FieldLabel className="text-[10px] font-bold text-gray-500 uppercase">
                    Full Name
                  </FieldLabel>
                  <Input
                    {...register("name")}
                    placeholder="John Doe"
                    className="h-10 border-gray-200"
                    disabled={isMutating || !!user}
                  />
                  {errors.name && <FieldError errors={[errors.name]} />}
                </Field>

                <Field data-invalid={!!errors.email}>
                  <FieldLabel className="text-[10px] font-bold text-gray-500 uppercase">
                    Email Address
                  </FieldLabel>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="john@example.com"
                    className="h-10 border-gray-200"
                    disabled={isMutating || !!user}
                  />
                  {errors.email && <FieldError errors={[errors.email]} />}
                </Field>

                <Field data-invalid={!!errors.phone}>
                  <FieldLabel className="text-[10px] font-bold text-gray-500 uppercase">
                    Phone Number
                  </FieldLabel>
                  <Input
                    {...register("phone")}
                    type="tel"
                    placeholder="+880 1XXXXXXXXX"
                    className="h-10 border-gray-200"
                    disabled={isMutating || (!!user && !!(user as any).phone)}
                  />
                  {errors.phone && <FieldError errors={[errors.phone]} />}
                </Field>

                <Button
                  type="submit"
                  className="mt-6 h-12 w-full bg-rose-800 text-base font-semibold hover:cursor-pointer hover:bg-rose-900"
                  disabled={isMutating}
                >
                  {isMutating ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    `Pay ${tier.price.charAt(0)}${totalAmount.toLocaleString()}`
                  )}
                </Button>

                {stripeError && (
                  <p className="mt-2 text-xs font-medium text-[#EF4444] text-center">
                    {stripeError}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-500">
                  <ShieldCheck size={14} /> Secure Tokenized Stripe Payment
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  )
}
