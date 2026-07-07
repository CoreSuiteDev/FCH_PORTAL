"use client"

import React, { useState, useEffect } from "react"
import { RefreshCw, Users, TicketX } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { toast } from "@workspace/ui/components/sonner"

import { MembershipStats } from "./membership-stats"
import { MembershipTable } from "./membership-table"
import { CancellationRequestsPanel } from "./cancellation-requests-panel"
import { useMemberships, useUpdateMembershipStatus, useDeleteMembership } from "@/hooks/useMembership"
import { useCancellationRequests } from "@/hooks/useCancellationRequests"

type Tab = "members" | "cancellations"

export const MembershipManager = () => {
  const [activeTab, setActiveTab] = useState<Tab>("members")

  // ── Members tab state ────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTier, setSelectedTier] = useState<string>("ALL")
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const { data, isLoading, isError } = useMemberships(
    currentPage,
    itemsPerPage,
    searchQuery,
    selectedTier,
    selectedStatus
  )

  const { mutateAsync: updateStatus } = useUpdateMembershipStatus()
  const { mutateAsync: deleteMembership } = useDeleteMembership()

  // Cancellation badge count (pending only)
  const { data: cancelData } = useCancellationRequests(1, 1, "PENDING")
  const pendingCancelCount = cancelData?.totalCount ?? 0

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedTier, selectedStatus])

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load membership records from server.")
    }
  }, [isError])

  const stats = data?.stats || { total: 0, active: 0, pending: 0, expiredOrCanceled: 0 }
  const pricingStats = data?.pricingStats || {
    general: { earnings: 0, monthlyCount: 0, yearlyCount: 0 },
    pastoral: { earnings: 0, monthlyCount: 0, yearlyCount: 0 },
  }

  const paginatedData = data?.data || []
  const totalPages = Math.ceil((data?.totalCount || 0) / itemsPerPage)

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus as any })
      toast.success(`Membership status updated to ${newStatus}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update membership status.")
    }
  }

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteMembership(id)
      toast.success("Membership record deleted successfully")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete membership record.")
    }
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedTier("ALL")
    setSelectedStatus("ALL")
    setCurrentPage(1)
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50 dark:bg-slate-900/40">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Membership Status Manager
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Review active plans, approve pending applicants, and process cancellation requests.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <MembershipStats
        stats={stats}
        pricingStats={pricingStats}
        salesStats={data?.salesStats}
        cancelStats={data?.cancelStats}
      />

      {/* Tab Switcher */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("members")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "members"
              ? "border-slate-900 text-slate-900 dark:border-slate-50 dark:text-slate-50"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Users className="size-4" />
          Members
        </button>
        <button
          onClick={() => setActiveTab("cancellations")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "cancellations"
              ? "border-slate-900 text-slate-900 dark:border-slate-50 dark:text-slate-50"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <TicketX className="size-4" />
          Cancellation Requests
          {pendingCancelCount > 0 && (
            <Badge className="bg-red-600 text-white text-[10px] h-4 min-w-4 px-1 rounded-full">
              {pendingCancelCount}
            </Badge>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "members" ? (
        <MembershipTable
          paginatedData={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={data?.totalCount ?? 0}
          setCurrentPage={setCurrentPage}
          handleUpdateStatus={handleUpdateStatus}
          handleDeleteRecord={handleDeleteRecord}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTier={selectedTier}
          setSelectedTier={setSelectedTier}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          handleResetFilters={handleResetFilters}
          isLoading={isLoading}
        />
      ) : (
        <CancellationRequestsPanel />
      )}
    </div>
  )
}
