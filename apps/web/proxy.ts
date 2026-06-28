import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if we are on an auth page
  const isAuthPage = [
    "/login",
    "/registation",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ].some((path) => pathname.startsWith(path))

  if (isAuthPage) {
    const sessionCookie = request.cookies.get("better-auth.session_token")?.value
    const secureCookie = request.cookies.get("__Secure-better-auth.session_token")?.value
    const token = sessionCookie || secureCookie

    if (token) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const response = await fetch(`${backendUrl}/api/auth/get-session`, {
          headers: {
            cookie: `better-auth.session_token=${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data && data.session) {
            const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/"
            return NextResponse.redirect(new URL(portalUrl))
          }
        }
      } catch (error) {
        console.error("[Web Middleware] Session check failed:", error)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login",
    "/registation",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ],
}
