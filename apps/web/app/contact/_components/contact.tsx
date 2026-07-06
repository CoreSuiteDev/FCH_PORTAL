"use client"

import { Button } from "@workspace/ui/components/button"
import { Clock, Loader2, Mail, MapPin } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,

  } = useForm()

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    reset()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-6">
      {/* Subtle Background Decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[900px] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Sidebar Section */}
          <div className="bg-primary p-8 text-primary-foreground md:col-span-5">
            <h2 className="font-trajan text-2xl font-bold">Get in touch</h2>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
              Have questions about our services or need technical support? Our
              team is here to assist you 24/7.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary-foreground/10 p-3">
                  <Mail size={20} />
                </div>
                <span className="text-sm">support@yourcompany.com</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary-foreground/10 p-3">
                  <MapPin size={20} />
                </div>
                <span className="text-sm">123 Business St, Tech City</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary-foreground/10 p-3">
                  <Clock size={20} />
                </div>
                <span className="text-sm">Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 md:col-span-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Full Name
                  </label>
                  <input
                    {...register("name", { required: true })}
                    className="flex h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Email Address
                  </label>
                  <input
                    {...register("email", { required: true })}
                    className="flex h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="name@company.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Message
                  </label>
                  <textarea
                    {...register("message", { required: true })}
                    rows={4}
                    className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="How can we help you?"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-lg bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
