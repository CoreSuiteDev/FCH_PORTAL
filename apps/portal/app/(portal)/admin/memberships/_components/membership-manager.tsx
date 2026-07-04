"use client"

import React, { useState, useMemo } from "react"
import { RefreshCw } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"

import { MembershipStats } from "./membership-stats"
import { MembershipFilters } from "./membership-filters"
import { MembershipTable } from "./membership-table"

// We use the mock users database but add state management to simulate DB mutations
import { userMembersData as initialData, UserMember } from "@/constants/manage-users-data"

export const MembershipManager = () => {
  const [dataList, setDataList] = useState<UserMember[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTier, setSelectedTier] = useState<string>("ALL")
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // 1. Calculate stats dynamically based on the current data state
  const stats = useMemo(() => {
    const total = dataList.length
    const active = dataList.filter((m) => m.status === "Active").length
    const pending = dataList.filter((m) => m.status === "Pending").length
    const expiredOrCanceled = dataList.filter(
      (m) => m.status === "Expired" || m.status === "Canceled"
    ).length

    return { total, active, pending, expiredOrCanceled }
  }, [dataList])

  // 1b. Calculate pricing metrics dynamically by package tier
  const pricingStats = useMemo(() => {
    const pStats = {
      general: { earnings: 0, monthlyCount: 0, yearlyCount: 0 },
      pastoral: { earnings: 0, monthlyCount: 0, yearlyCount: 0 },
    }

    dataList.forEach((m) => {
      const amount = Number(m.amountPaid.replace(/[^0-9.-]+/g, "")) || 0
      
      if (m.tier === "General") {
        pStats.general.earnings += amount
        if (m.status === "Active") {
          if (amount <= 50) pStats.general.monthlyCount++
          else pStats.general.yearlyCount++
        }
      } else if (m.tier === "Pastoral" || m.tier === "Board") {
        pStats.pastoral.earnings += amount
        if (m.status === "Active") {
          if (amount <= 150) pStats.pastoral.monthlyCount++
          else pStats.pastoral.yearlyCount++
        }
      }
    })

    return pStats
  }, [dataList])

  // 2. Filter logic
  const filteredData = useMemo(() => {
    return dataList.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTier = selectedTier === "ALL" || m.tier === selectedTier
      const matchesStatus = selectedStatus === "ALL" || m.status === selectedStatus

      return matchesSearch && matchesTier && matchesStatus
    })
  }, [dataList, searchQuery, selectedTier, selectedStatus])

  // 3. Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage])

  // 4. Status actions (simulation of DB mutations)
  const handleUpdateStatus = (id: string, newStatus: UserMember["status"]) => {
    setDataList((prev) =>
      prev.map((user) => (user.id === id ? { ...user, status: newStatus } : user))
    )
    toast.success(`Membership status updated to ${newStatus}`)
  }

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this membership record?")) {
      setDataList((prev) => prev.filter((user) => user.id !== id))
      toast.success("Membership record deleted successfully")
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
            Review active plans, approve pending applicants, and synchronize group access.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResetFilters} className="hover:cursor-pointer gap-1.5 h-9">
            <RefreshCw className="size-3.5" /> Reset Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards Overview */}
      <MembershipStats stats={stats} pricingStats={pricingStats} />

      {/* Filter and Search Section */}
      <MembershipFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTier={selectedTier}
        setSelectedTier={setSelectedTier}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Main Members History Table */}
      <MembershipTable
        paginatedData={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        handleUpdateStatus={handleUpdateStatus}
        handleDeleteRecord={handleDeleteRecord}
      />
    </div>
  )
}
