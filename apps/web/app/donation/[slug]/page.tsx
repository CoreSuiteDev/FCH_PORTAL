"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import { Check, CheckCircle, CreditCard, X } from "lucide-react"
import Container from "@/components/shared/container"

export default function DonateDetailsPage() {
  const t = useTranslations("donatePage.DonateDetailsPage")
  const params = useParams()
  const amount = Number(params.slug) || 3000

  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  })

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessModal])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "number") {
      setFormData((prev) => ({
        ...prev,
        number: value.replace(/\D/g, "").slice(0, 16),
      }))
    } else if (name === "expiry") {
      let val = value.replace(/\D/g, "")
      if (val.length > 4) val = val.slice(0, 4)
      setFormData((prev) => ({
        ...prev,
        expiry: val.length > 2 ? `${val.slice(0, 2)}/${val.slice(2)}` : val,
      }))
    } else if (name === "cvc") {
      setFormData((prev) => ({
        ...prev,
        cvc: value.replace(/\D/g, "").slice(0, 3),
      }))
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
    )
      return
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowSuccessModal(true)
  }

  return (
    <section>
      <Container className="py-12">
        <button className="mb-6 text-sm text-gray-500 hover:text-gray-800">
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

              <form onSubmit={handlePaymentSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                    {t("payment.cardholder")}
                  </label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="John Doe"
                    className="mt-2 w-full rounded-lg border border-[#F1F1E8] bg-[#F8F8F1] p-3"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                    {t("payment.cardNumber")}
                  </label>
                  <input
                    name="number"
                    required
                    value={formData.number}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    className="mt-2 w-full rounded-lg border border-[#F1F1E8] bg-[#F8F8F1] p-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                      {t("payment.expiry")}
                    </label>
                    <input
                      name="expiry"
                      required
                      value={formData.expiry}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="MM/YY"
                      className="mt-2 w-full rounded-lg border border-[#F1F1E8] bg-[#F8F8F1] p-3"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                      {t("payment.cvc")}
                    </label>
                    <input
                      name="cvc"
                      required
                      value={formData.cvc}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="123"
                      className="mt-2 w-full rounded-lg border border-[#F1F1E8] bg-[#F8F8F1] p-3"
                    />
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

                <Button
                  disabled={isProcessing}
                  className="w-full rounded-lg bg-[#AC172C] py-6 text-lg font-bold text-white hover:bg-[#8F1324]"
                >
                  {isProcessing ? t("payment.processing") : t("payment.button")}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
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
