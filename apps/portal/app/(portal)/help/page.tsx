"use client"

import React, { useState, useMemo } from "react"
import {
  IconHelp,
  IconMessage,
  IconSend,
  IconLoader2,
  IconChevronDown,
  IconSearch,
  IconTicket,
  IconUser,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react"
import { useUserTickets, useCreateTicket } from "@/hooks/useSupport"
import { toast } from "@workspace/ui/components/sonner"

// ─── FAQ Data ────────────────────────────────────────────────────────────────
const FAQS = [
  {
    category: "membership",
    question: "How do I upgrade my membership to Pastoral?",
    answer: "Go to your Account Settings or the Billing & Membership section, choose the Pastoral package, and complete the Stripe checkout. Your role will be instantly updated.",
  },
  {
    category: "membership",
    question: "How can I cancel my membership subscription?",
    answer: "Go to Account -> Billing & Membership, and click 'Cancel Membership'. Your request will be reviewed by the admin, and any pro-rata refunds will be processed via Stripe.",
  },
  {
    category: "general",
    question: "What benefits do General members get?",
    answer: "General members get access to General FCH Documents, member-only newsletters, the learning library, and standard FCH events & webinars.",
  },
  {
    category: "pastoral",
    question: "Can I access Pastoral webinars as a General Member?",
    answer: "No. Pastoral webinars and resources are restricted to accounts with approved Pastoral or Board membership level. Make sure your account is upgraded.",
  },
  {
    category: "billing",
    question: "What happens if my payment fails?",
    answer: "We offer a 7-day grace period for failed subscription renewals. If unpaid after 7 days, your account status will downgrade to basic access automatically.",
  },
  {
    category: "support",
    question: "How long does it take for support tickets to be resolved?",
    answer: "Our support administrators usually review and process all support tickets within 24 to 48 hours. You will see their response note directly on this page once resolved.",
  },
]

export default function HelpPage() {
  const { data: tickets, isLoading: isTicketsLoading, refetch } = useUserTickets()
  const createTicketMutation = useCreateTicket()

  // FAQ states
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null)

  // Ticket form states
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        activeCategory === "all" || faq.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory])

  // Handle Ticket Submission
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    try {
      await createTicketMutation.mutateAsync({ subject, message })
      toast.success("Support ticket created successfully!")
      setSubject("")
      setMessage("")
      refetch()
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || "Failed to create support ticket"
      toast.error(errMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 border border-amber-500/20"
      case "OPEN":
        return "bg-sky-500/10 text-sky-600 border border-sky-500/20"
      case "RESOLVED":
        return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
      case "CLOSED":
        return "bg-slate-500/10 text-slate-600 border border-slate-500/20"
      default:
        return "bg-slate-500/10 text-slate-600 border border-slate-500/20"
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-primary bg-linear-to-r from-primary to-primary p-8 text-white shadow-md dark:border-primary">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 space-y-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Support Center
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            How can we help you today?
          </h2>
          <p className="max-w-2xl text-rose-100/90 text-sm">
            Search our frequently asked questions, read guides, or submit a support ticket. 
            Our dedicated team is ready to assist you.
          </p>
        </div>
      </div>

      {/* ─── Main Grid Layout ───────────────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: FAQ and Ticket Creation */}
        <div className="lg:col-span-2 space-y-8">
          {/* FAQ Section */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4">
              <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
                <IconHelp className="size-5.5 text-rose-500" />
                Frequently Asked Questions
              </h3>
              {/* Category tabs */}
              <div className="flex flex-wrap gap-1">
                {["all", "membership", "billing", "pastoral", "support"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat)
                      setExpandedFaqIndex(null)
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                      activeCategory === cat
                        ? "bg-primary text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mt-5">
              <IconSearch className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search FAQs by keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm outline-hidden transition-all placeholder:text-muted-foreground focus:border-rose-500 focus:bg-background focus:ring-2 focus:ring-rose-500/20 dark:bg-slate-900"
              />
            </div>

            {/* FAQs Accordion */}
            <div className="mt-6 space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => {
                  const isExpanded = expandedFaqIndex === index
                  return (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-900 dark:bg-slate-900/50"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                        className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900"
                      >
                        <span className="text-foreground">{faq.question}</span>
                        <IconChevronDown
                          className={`size-4.5 text-slate-500 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-rose-500" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ${
                          isExpanded ? "max-h-40 border-t" : "max-h-0"
                        } overflow-hidden`}
                      >
                        <p className="p-4 text-xs leading-relaxed text-muted-foreground bg-white dark:bg-background">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No matching frequently asked questions found.
                </div>
              )}
            </div>
          </div>

          {/* Ticket Creation Form */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 border-b pb-4 text-xl font-bold tracking-tight text-foreground">
              <IconMessage className="size-5.5 text-rose-500" />
              Submit a Support Ticket
            </h3>
            <form onSubmit={handleSubmitTicket} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  placeholder="Briefly summarize your request (e.g. Card renewal failing)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full rounded-xl border bg-slate-50/50 px-4 py-2.5 text-sm outline-hidden transition-all placeholder:text-muted-foreground focus:border-rose-500 focus:bg-background focus:ring-2 focus:ring-rose-500/20 dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80">
                  Detailed Message
                </label>
                <textarea
                  placeholder="Describe your issue or question in detail. If billing issue, provide invoice date..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full rounded-xl border bg-slate-50/50 px-4 py-2.5 text-sm outline-hidden transition-all placeholder:text-muted-foreground focus:border-rose-500 focus:bg-background focus:ring-2 focus:ring-rose-500/20 dark:bg-slate-900 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-rose-600 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin" /> Submitting Ticket...
                  </>
                ) : (
                  <>
                    <IconSend className="size-4" /> Submit Support Ticket
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Support Tickets History */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm min-h-[400px]">
            <h3 className="flex items-center gap-2 border-b pb-4 text-xl font-bold tracking-tight text-foreground">
              <IconTicket className="size-5.5 text-rose-500" />
              My Support Tickets
            </h3>

            {isTicketsLoading ? (
              <div className="mt-8 space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="space-y-2 rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-5 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <div className="h-10 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                ))}
              </div>
            ) : tickets && tickets.length > 0 ? (
              <div className="mt-5 space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="group rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-slate-200 dark:border-slate-900 dark:bg-slate-900/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-500">
                        {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <h4 className="mt-2 text-sm font-bold text-foreground">
                      {ticket.subject}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed break-words">
                      {ticket.message}
                    </p>

                    {/* Admin Note if resolved or closed */}
                    {ticket.adminNote && (
                      <div className="mt-3 rounded-lg bg-emerald-500/5 p-3 text-[11px] text-emerald-600 border border-emerald-500/10">
                        <div className="flex gap-2">
                          <IconCheck className="size-4 shrink-0 text-emerald-500" />
                          <div>
                            <span className="font-bold">Admin Resolution:</span>
                            <p className="mt-0.5 text-emerald-700/90 dark:text-emerald-400 break-words font-medium">
                              {ticket.adminNote}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pending state details */}
                    {!ticket.adminNote && ticket.status === "PENDING" && (
                      <div className="mt-3 rounded-lg bg-amber-500/5 p-3 text-[11px] text-amber-600 border border-amber-500/10">
                        <div className="flex gap-2">
                          <IconAlertCircle className="size-4 shrink-0 text-amber-500" />
                          <span>Under review by administrators</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-16 text-center space-y-3">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                  <IconUser className="size-6 text-slate-400" />
                </div>
                <p className="text-xs text-muted-foreground">
                  You have not submitted any support tickets yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
