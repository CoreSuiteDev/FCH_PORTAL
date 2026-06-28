import { useState, useEffect } from "react"

export interface SessionUser {
  id: string
  email: string
  name: string
  image?: string | null
  roles: string[]
}

export interface SessionInfo {
  authenticated: boolean
  user: SessionUser | null
}

export function useSessionInfo() {
  const [session, setSession] = useState<SessionInfo>({
    authenticated: false,
    user: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session-info")
        if (res.ok) {
          const data = await res.json()
          if (active) {
            setSession(data)
          }
        }
      } catch (err) {
        console.error("Failed to fetch session info client-side:", err)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchSession()
    return () => {
      active = false
    }
  }, [])

  return { ...session, loading }
}
