import React from "react"
import { Skeleton } from "@workspace/ui/components/skeleton"

export function LoadingSkeletons() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-28 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
