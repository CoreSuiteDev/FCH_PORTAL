"use client"
"use no compiler"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSessionInfo } from "@/hooks/use-session-info"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function PortalIndexRedirectPage() {
  const { data: session, isLoading } = useSessionInfo()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && session?.user) {
      const roles = session.user.roles || []
      if (roles.includes("BOARD")) {
        router.replace("/portal/board")
      } else if (roles.includes("PASTORAL")) {
        router.replace("/portal/pastoral")
      } else {
        router.replace("/portal/general")
      }
    }
  }, [session, isLoading, router])

  return (
    <div className="flex-1 p-8 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      <Skeleton className="h-9 w-64 mb-4" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  )
}
