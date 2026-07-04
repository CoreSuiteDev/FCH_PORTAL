"use client"

import React, { useState } from "react"
import { usePackages } from "@/hooks/usePackage"
import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import { ZTCMembershipPackage } from "@workspace/types"

import { PackagesTable } from "./_components/packages-table"
import { PackageFormDialog } from "./_components/package-form-dialog"
import { DeleteConfirmDialog } from "./_components/delete-confirm-dialog"

export default function MembershipPackagesPage() {
  const { data: packages = [], isLoading, isError } = usePackages()

  // Modals & Context States
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<ZTCMembershipPackage | null>(null)
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditingPackage(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (pkg: ZTCMembershipPackage) => {
    setEditingPackage(pkg)
    setIsFormOpen(true)
  }

  const handleOpenDelete = (id: string) => {
    setPackageToDelete(id)
    setIsDeleteOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900/40">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Membership Packages</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Configure subscription pricing, billing cycles, and features for member tiers.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="hover:cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Create Package
        </Button>
      </div>

      {/* Table Component */}
      <PackagesTable
        packages={packages}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Dialog Components */}
      <PackageFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        editingPackage={editingPackage}
        onSuccess={() => setEditingPackage(null)}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        packageId={packageToDelete}
        onSuccess={() => setPackageToDelete(null)}
      />
    </div>
  )
}
