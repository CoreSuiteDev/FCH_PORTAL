"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Check, CheckCircle, CreditCard, X, Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"

// Workspace UI Components
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"
import Container from "@/components/shared/container"
import { useDonate } from "@/hooks/useDonation"
import { authClient } from "@/lib/auth"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
)

// Zod validation schema
const paymentSchema = z.object({
  name: z.string().min(1, "Cardholder name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

export default function DonateDetailsPage() {
  return (
    <Elements stripe={stripePromise}>
      <DonateDetailsForm />
    </Elements>
  )
}

function DonateDetailsForm() {
  const t = useTranslations("donatePage.DonateDetailsPage")
  const params = useParams()
  const amount = Number(params.slug) || 3000

  const stripe = useStripe()
  const elements = useElements()

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { mutateAsync: donate, isPending } = useDonate()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: (user as any).phone || "",
      })
    }
  }, [user, form])

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessModal])

  const onSubmit = async (data: PaymentFormValues) => {
    setErrorMessage(null)

    try {
      if (!stripe || !elements) {
        throw new Error("Stripe has not loaded yet. Please try again.")
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error("Payment fields are not ready. Please refresh.")
      }

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
        },
      })

      if (error) {
        throw new Error(error.message || "Failed to process card details.")
      }

      if (!paymentMethod) {
        throw new Error("Failed to process payment method. Please try again.")
      }

      await donate({
        amount,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        paymentMethodId: paymentMethod.id,
        userId: user?.id || undefined,
      })

      // Successful payment!
      setShowSuccessModal(true)
      form.reset()
      cardElement.clear()
    } catch (err: unknown) {
      console.error("Payment Error:", err)
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during payment."
      setErrorMessage(msg)
    }
  }

  return (
    <section>
      <Container className="py-12">
        <button className="mb-6 text-sm text-gray-500 transition-colors hover:text-gray-800">
          {t("back")}
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Side */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#8B0033]">
              {t("selectedPackage")}
            </span>
            <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
              {t("title")}
            </h2>
            <div className="my-4 text-3xl font-bold text-gray-900">
              ${amount}{" "}
              <span className="text-lg font-normal text-gray-500">
                {t("oneTime")}
              </span>
            </div>
            <div className="space-y-4 pt-6">
              <h3 className="font-semibold text-gray-700">
                {t("includedImpact")}
              </h3>
              <ul className="space-y-3">
                {["mission", "education", "community"].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Check className="h-5 w-5 text-[#8B0033]" />{" "}
                    {t(`impact.${item}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-lg">
            <div className="h-1.5 w-full bg-[#AC172C]" />
            <div className="space-y-6 p-8">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-[#AC172C]" />
                <h2 className="text-xl font-semibold text-[#1A1A1A]">
                  {t("payment.title")}
                </h2>
              </div>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Donor Details Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold tracking-widest text-[#8B0033] uppercase">
                    {t("payment.donorSection")}
                  </h3>
                  <FieldGroup className="space-y-4">
                    {/*  Name */}
                    <Controller
                      name="name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                            {t("payment.cardholder")}
                          </FieldLabel>
                          <Input
                            {...field}
                            type="text"
                            placeholder="John Doe"
                            disabled={isPending || !!user}
                            aria-invalid={fieldState.invalid}
                            className="mt-2 h-12 w-full rounded-lg border border-[#F1F1E8] bg-[#F8F8F1] p-3 shadow-none focus-visible:border-gray-300 focus-visible:ring-0"
                          />
                          {fieldState.invalid && (
                            <FieldError
                              errors={[fieldState.error]}
                              className="mt-1"
                            />
                          )}
                        </Field>
                      )}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Email Address */}
                      <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                              {t("payment.email")}
                            </FieldLabel>
                            <Input
                              {...field}
                              type="email"
                              placeholder="johndoe@example.com"
                              disabled={isPending || !!user}
                              aria-invalid={fieldState.invalid}
                              className="mt-2 h-12 w-full rounded-lg border border-[#F1F1E8] bg-[#F8F8F1] p-3 shadow-none focus-visible:border-gray-300 focus-visible:ring-0"
                            />
                            {fieldState.invalid && (
                              <FieldError
                                errors={[fieldState.error]}
                                className="mt-1"
                              />
                            )}
                          </Field>
                        )}
                      />

                      {/* Phone Number */}
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                              {t("payment.phone")}
                            </FieldLabel>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              disabled={isPending}
                              aria-invalid={fieldState.invalid}
                              className="mt-2 h-12 w-full rounded-lg border border-[#F1F1E8] bg-[#F8F8F1] p-3 shadow-none focus-visible:border-gray-300 focus-visible:ring-0"
                            />
                            {fieldState.invalid && (
                              <FieldError
                                errors={[fieldState.error]}
                                className="mt-1"
                              />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </FieldGroup>
                </div>

                <hr className="border-gray-200/60" />

                {/* Card Details Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold tracking-widest text-[#8B0033] uppercase">
                    {t("payment.cardSection")}
                  </h3>
                  <div className="space-y-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                    <FieldGroup className="space-y-4">
                      <Field>
                        <FieldLabel className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                          {t("payment.cardSection")}
                        </FieldLabel>
                        <div className="mt-2 rounded-lg border border-[#F1F1E8] bg-[#F8F8F1] p-4 shadow-none">
                          <CardElement
                            options={{
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "#1A1A1A",
                                  fontFamily: "inherit",
                                  "::placeholder": {
                                    color: "#A0A0A0",
                                  },
                                },
                                invalid: {
                                  color: "#EF4444",
                                },
                              },
                            }}
                          />
                        </div>
                      </Field>
                    </FieldGroup>
                  </div>
                </div>

                <div className="space-y-3 rounded-xl bg-[#F6F6F6] p-5 text-gray-700">
                  <div className="flex justify-between">
                    <span>{t("payment.amount")}</span>{" "}
                    <span className="font-medium">${amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("payment.fee")}</span>{" "}
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 font-bold text-gray-900">
                    <span>{t("payment.total")}</span>{" "}
                    <span className="text-[#AC172C]">${amount}</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-lg bg-[#AC172C] py-6 text-lg font-bold text-white transition-colors hover:bg-[#8F1324]"
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    t("payment.button")
                  )}
                </Button>
              </form>
            </div>
            <div className="flex items-center justify-center gap-2 border-t border-gray-100 bg-[#F9F9F9] px-8 py-4">
              <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
              <p className="text-xs text-gray-500">{t("payment.secure")}</p>
            </div>
          </div>
        </div>
      </Container>

      {/* Success Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/50 p-4 duration-200 fade-in">
          <div className="relative w-full max-w-sm animate-in rounded-2xl bg-white p-8 text-center shadow-xl duration-200 zoom-in-95">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-black"
            >
              <X size={20} />
            </button>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              {t("success.title")}
            </h3>
            <p className="mt-2 text-gray-600">{t("success.description")}</p>
          </div>
        </div>
      )}
    </section>
  )
}
