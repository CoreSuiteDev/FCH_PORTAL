"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconAlertCircle,
  IconCheck,
  IconClock,
  IconX,
  IconCreditCard,
  IconReceiptRefund,
  IconHelp,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "@workspace/ui/components/sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { useSessionInfo } from "@/hooks/use-session-info"
import {
  useMyMemberships,
  useMyCancellationRequests,
  useRequestCancellation,
  UserSubscriptionDetails,
} from "@/hooks/useMembership"

// ─── status styles ─────────────────────────────────────────────────────────

const STATUS_STYLE: Record<
  string,
  { className: string; icon: React.ReactNode; label: string }
> = {
  PENDING: {
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400",
    icon: <IconClock className="size-4" />,
    label: "Pending Review",
  },
  APPROVED: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400",
    icon: <IconCheck className="size-4" />,
    label: "Approved",
  },
  REJECTED: {
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400",
    icon: <IconX className="size-4" />,
    label: "Rejected",
  },
}

export default function UserMembershipBillingPage() {
  const router = useRouter()
  const { data: session, isLoading: loadingSession } = useSessionInfo()
  const userId = session?.user?.id ?? ""

  const { data: memberships = [], isLoading: loadingSubs } = useMyMemberships(userId)
  const { data: myRequests = [], isLoading: loadingRequests, refetch } = useMyCancellationRequests(userId)
  const { mutateAsync: requestCancellation, isPending } = useRequestCancellation()

  const [selectedSubId, setSelectedSubId] = useState<string>("")
  const [reason, setReason] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Find the selected subscription details
  const selectedSub = memberships.find((s) => s.id === selectedSubId)

  // Client-side pro-rata estimation
  const estimateRefund = () => {
    if (!selectedSub) return 0
    const now = Date.now()
    const end = new Date(selectedSub.expiryDate || "").getTime()
    const amountStr = selectedSub.amountPaid?.replace(/[^0-9.]/g, "") || "0"
    const amount = parseFloat(amountStr)
    const billingDays = selectedSub.billingCycle === "MONTHLY" ? 30 : 365
    const msPerDay = 86400000
    const daysLeft = Math.max(0, (end - now) / msPerDay)
    return parseFloat(((amount / billingDays) * daysLeft).toFixed(2))
  }

  const hasPendingForSub = myRequests.some(
    (r) => r.subscriptionId === selectedSubId && r.status === "PENDING"
  )

  const handleSubmit = async () => {
    if (!selectedSubId) {
      toast.error("Please select a subscription.")
      return
    }
    if (reason.trim().length < 10) {
      toast.error("Please provide a reason (at least 10 characters).")
      return
    }

    try {
      const result = await requestCancellation({
        userId,
        subscriptionId: selectedSubId,
        reason,
      })
      toast.success(
        `Cancellation request submitted. Estimated refund: $${result.estimatedRefund?.toFixed(2)}`
      )
      refetch()
      setReason("")
      setSelectedSubId("")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit cancellation request.")
    } finally {
      setConfirmOpen(false)
    }
  }

  const isLoading = loadingSession || loadingSubs || loadingRequests

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 min-h-screen bg-slate-50/50 dark:bg-slate-900/40">
      {/* Back button & Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 -ml-2 cursor-pointer"
          onClick={() => router.push("/portal/profile")}
        >
          <IconArrowLeft className="size-4" /> Back to Profile
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Manage Membership &amp; Billing
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              View your subscription details, transaction history, or request a membership cancellation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Left Column: Form / Status */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active Subscriptions Card */}
          <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Active Subscriptions</CardTitle>
              <CardDescription>
                Select a subscription below to request a cancellation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ) : memberships.filter((m) => m.status === "Active").length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 space-y-2">
                  <IconCreditCard className="size-8 mx-auto text-slate-400" />
                  <p className="text-sm font-medium">No active subscriptions found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {memberships
                    .filter((m) => m.status === "Active")
                    .map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubId(sub.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedSubId === sub.id
                            ? "border-slate-900 bg-slate-50/50 dark:border-slate-100 dark:bg-slate-900/50"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="font-bold text-sm text-slate-900 dark:text-slate-50">
                              {sub.packageName}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Tier: <span className="capitalize">{sub.tier}</span> · Cycle:{" "}
                              {sub.billingCycle === "MONTHLY" ? "Monthly" : "Yearly"} · Amount:{" "}
                              {sub.amountPaid}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Joined: {sub.joinedDate} · Expires: {sub.expiryDate}
                            </div>
                          </div>
                          {selectedSubId === sub.id && (
                            <IconCheck className="size-5 text-slate-900 dark:text-slate-50 shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cancellation Request Section */}
          {selectedSub && (
            <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 animate-in fade-in-50 duration-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Request Cancellation</CardTitle>
                <CardDescription>
                  Please provide a brief reason for cancelling your FCH membership.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Pro-rata estimation notice */}
                <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900/40">
                  <IconReceiptRefund className="size-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-sm text-emerald-800 dark:text-emerald-300 space-y-1">
                    <p className="font-semibold">Calculated Partial Refund</p>
                    <p>
                      Based on remaining days in your billing cycle, your estimated refund is{" "}
                      <strong className="text-emerald-700 dark:text-emerald-400">
                        ${estimateRefund().toFixed(2)}
                      </strong>
                      . This will be issued to your original payment method upon admin approval.
                    </p>
                  </div>
                </div>

                {/* Reason Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm font-semibold">
                    Reason for Cancellation
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    rows={4}
                    placeholder="e.g. Relocating, changed role, or not using the portal enough (minimum 10 characters)…"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="resize-none text-sm border-slate-200 dark:border-slate-800"
                  />
                  <p className="text-[11px] text-slate-400">{reason.length} characters</p>
                </div>

                {hasPendingForSub && (
                  <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3 rounded-lg">
                    <IconClock className="size-4 shrink-0" />
                    You already have a pending cancellation request for this subscription.
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    disabled={reason.trim().length < 10 || isPending || hasPendingForSub}
                    onClick={() => setConfirmOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  >
                    Submit Cancellation Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Request History & Policy */}
        <div className="space-y-6">
          {/* History Card */}
          <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Request History</CardTitle>
              <CardDescription>
                Track your active and historical cancellation requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              ) : myRequests.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-xs">No request history found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myRequests.map((req) => {
                    const s = STATUS_STYLE[req.status] ?? {
                      className: "border-slate-200 bg-slate-50 text-slate-600",
                      icon: <IconClock className="size-4" />,
                      label: req.status,
                    }
                    return (
                      <div
                        key={req.id}
                        className="p-4 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {req.packageName}
                          </span>
                          <Badge
                            variant="outline"
                            className={`gap-1 font-semibold text-[10px] py-0.5 px-2 ${s.className}`}
                          >
                            {s.icon}
                            {s.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                          &ldquo;{req.reason}&rdquo;
                        </p>
                        {req.adminNote && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 p-2 rounded-md border">
                            <strong>Admin Note:</strong> {req.adminNote}
                          </div>
                        )}
                        {req.refundAmount !== null && (
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Refund Amount: ${req.refundAmount.toFixed(2)}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400">
                          Requested:{" "}
                          {new Date(req.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cancellation Info Policy */}
          <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <IconHelp className="size-4 text-slate-400" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3 text-slate-500 dark:text-slate-400">
              <div className="space-y-1">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">
                  How long does review take?
                </h5>
                <p>
                  Most cancellation requests are processed by the administrative board within 2-3 business days.
                </p>
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">
                  When will I see the refund?
                </h5>
                <p>
                  Approved refunds are sent back to the card used at checkout. Depending on your bank, it may take 5-10 business days to post.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation AlertDialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Cancellation Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to request cancellation of your{" "}
              <strong>{selectedSub?.packageName}</strong> subscription?
              An estimated refund of <strong>${estimateRefund().toFixed(2)}</strong> will be calculated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? "Submitting Request..." : "Confirm & Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
