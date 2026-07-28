"use client"

import { useSponsorPlans } from "@/hooks/useSponsorPlan"
import { ZTCSponsorPlanResponse } from "@workspace/types"
import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import { useState } from "react"

import { DeleteConfirmDialog } from "./_components/delete-confirm-dialog"
import { PlanFormDialog } from "./_components/plan-form-dialog"
import { SponsorPlansTable } from "./_components/sponsor-plans-table"

export default function SponsorPlansPage() {
  const { data: plans = [], isLoading, isError } = useSponsorPlans()

  // Modals & Context States
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<ZTCSponsorPlanResponse | null>(
    null
  )
  const [planToDelete, setPlanToDelete] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditingPlan(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (plan: ZTCSponsorPlanResponse) => {
    setEditingPlan(plan)
    setIsFormOpen(true)
  }

  const handleOpenDelete = (id: string) => {
    setPlanToDelete(id)
    setIsDeleteOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sponsor Plans</h1>
          <p className="text-slate-500">
            {`Create, update, and manage your organization's sponsorship tiers.`}
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="hover:cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Create Plan
        </Button>
      </div>

      {/* Table Component */}
      <SponsorPlansTable
        plans={plans}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Dialog Components */}
      <PlanFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        editingPlan={editingPlan}
        onSuccess={() => setEditingPlan(null)}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        planId={planToDelete}
        onSuccess={() => setPlanToDelete(null)}
      />
    </div>
  )
}
