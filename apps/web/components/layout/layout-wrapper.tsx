"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Navbar from "./navbar"
import { Footer } from "./footer"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const authPaths = [
    "/login",
    "/registation",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
  ]

  const isAuthRoute = authPaths.some(
    (path) => pathname === path || pathname.endsWith(path)
  )

  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <div className="overflow-hidden">
      <Navbar />
      <div className="mt-20">{children}</div>
      <Footer />
    </div>
  )
}
