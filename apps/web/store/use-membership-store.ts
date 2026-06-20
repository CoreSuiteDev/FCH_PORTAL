import { create } from "zustand"

export type PackageTier = "general" | "pastoral"

export interface PackageMetadata {
  id: PackageTier
  title: string
  subtitle: string
  price: number
  billingPeriod: string
  description: string
  features: string[]
}

interface PackageState {
  selectedPackageId: PackageTier | null
  billingCycle: "monthly" | "yearly"
  selectPackage: (id: PackageTier) => void
  setBillingCycle: (cycle: "monthly" | "yearly") => void
  clearSelection: () => void
}

export const usePackageStore = create<PackageState>((set) => ({
  selectedPackageId: null,
  billingCycle: "monthly",
  selectPackage: (id: PackageTier) => set({ selectedPackageId: id }),
  setBillingCycle: (cycle: "monthly" | "yearly") =>
    set({ billingCycle: cycle }),
  clearSelection: () => set({ selectedPackageId: null }),
}))
