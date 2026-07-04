"use client"

import { ZTCMembershipPackage } from "@workspace/types"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Edit, ShieldAlert, Trash2, CheckCircle2, XCircle, Layers } from "lucide-react"

const TYPE_COLORS: Record<string, string> = {
  BOARD: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50",
  PASTORAL: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
  MEMBER: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/50",
  USER: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/50",
}

interface PackagesTableProps {
  packages: ZTCMembershipPackage[]
  isLoading: boolean
  isError: boolean
  onEdit: (pkg: ZTCMembershipPackage) => void
  onDelete: (id: string) => void
}

export const PackagesTable = ({
  packages,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: PackagesTableProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 h-80 animate-pulse">
            <div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded" />
                <Skeleton className="h-6 w-16 rounded" />
              </div>
              <Skeleton className="mt-4 h-6 w-2/3 rounded" />
              <Skeleton className="mt-2 h-4 w-1/2 rounded" />
              <Skeleton className="mt-6 h-8 w-24 rounded" />
              <div className="mt-6 space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-900">
              <Skeleton className="h-4 w-12 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-white py-16 text-center shadow-sm dark:border-red-950/20 dark:bg-slate-950">
        <ShieldAlert className="mb-4 h-12 w-12 text-red-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Failed to load packages</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please try refetching or check server logs.</p>
      </div>
    )
  }

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <Layers className="mb-4 h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">No packages found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get started by creating your first membership package.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => {
        const featuresArray = Array.isArray(pkg.features) ? (pkg.features as string[]) : []

        return (
          <div
            key={pkg.id}
            className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-950 ${
              pkg.isPopular
                ? "border-rose-500 ring-1 ring-rose-500/20 dark:border-rose-500/70"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            {pkg.isPopular && (
              <span className="absolute -top-3 left-6 inline-flex rounded-full bg-rose-500 px-3 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                Popular Choice
              </span>
            )}

            <div>
              {/* Card Header (Type & Status) */}
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={`capitalize ${TYPE_COLORS[pkg.type] || "bg-slate-100 text-slate-800"}`}
                >
                  {pkg.type.toLowerCase()}
                </Badge>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize text-[11px] py-0">
                    {pkg.billingCycle.toLowerCase()}
                  </Badge>
                  {pkg.isActive ? (
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Active" />
                  ) : (
                    <span className="flex h-2 w-2 rounded-full bg-slate-300" title="Inactive" />
                  )}
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{pkg.name}</h3>
                {pkg.subTitle && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium italic">
                    {pkg.subTitle}
                  </p>
                )}
              </div>

              {/* Pricing Section */}
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                  {pkg.currency === "USD" ? "$" : "€"}
                  {Number(pkg.price).toFixed(2)}
                </span>
                <span className="ml-1 text-xs text-slate-500 dark:text-slate-400 capitalize">
                  / {pkg.billingCycle.toLowerCase()}
                </span>
              </div>

              {/* Description */}
              {pkg.description && (
                <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {pkg.description}
                </p>
              )}

              {/* Features Preview */}
              {featuresArray.length > 0 && (
                <div className="mt-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {pkg.featureTitle || "Key Features"}
                  </p>
                  <ul className="mt-2 space-y-1.5 max-h-32 overflow-y-auto">
                    {featuresArray.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-900">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Sort Order: {pkg.sortOrder}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(pkg)}
                  className="h-8 w-8 hover:cursor-pointer"
                >
                  <Edit className="h-4 w-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(pkg.id)}
                  className="h-8 w-8 hover:cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
