import { useQuery } from "@tanstack/react-query"

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

export const useSessionInfo = () => {
  return useQuery<SessionInfo>({
    queryKey: ["session-info"],
    queryFn: async () => {
      const res = await fetch("/api/auth/session-info")
      if (!res.ok) {
        throw new Error("Failed to fetch session")
      }
      return res.json()
    },
  })
}
