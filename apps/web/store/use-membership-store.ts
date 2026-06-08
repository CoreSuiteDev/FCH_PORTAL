import { create } from "zustand"

export type PackageTier = "general" | "pastoral" | "board"

export interface PackageMetadata {
  id: PackageTier
  title: string
  price: number
  billingPeriod: string
  description: string
  features: string[]
}

interface PackageState {
  selectedPackageId: PackageTier | null
  selectPackage: (id: PackageTier) => void
  clearSelection: () => void
}

export const usePackageStore = create<PackageState>((set) => ({
  selectedPackageId: null,
  selectPackage: (id: PackageTier) => set({ selectedPackageId: id }),
  clearSelection: () => set({ selectedPackageId: null }),
}))
