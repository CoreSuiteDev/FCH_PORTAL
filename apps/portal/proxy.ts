import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  // Get session token from cookies
  const sessionCookie = request.cookies.get("better-auth.session_token")?.value

  // We should also check for secure cookie if running on HTTPS
  const secureCookie = request.cookies.get("__Secure-better-auth.session_token")?.value
  const token = sessionCookie || secureCookie

  if (!token) {
    const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL || "http://localhost:3000/login"
    return NextResponse.redirect(new URL(loginUrl))
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${backendUrl}/api/auth/get-session`, {
      headers: {
        cookie: `better-auth.session_token=${token}`,
      },
    })

    if (!response.ok) {
      const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL || "http://localhost:3000/login"
      return NextResponse.redirect(new URL(loginUrl))
    }

    const data = await response.json()

    if (!data || !data.session) {
      const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL || "http://localhost:3000/login"
      return NextResponse.redirect(new URL(loginUrl))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("[Middleware] Session check failed:", error)
    const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL || "http://localhost:3000/login"
    return NextResponse.redirect(new URL(loginUrl))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon file, or assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets|forbidden|help).*)",
  ],
}
