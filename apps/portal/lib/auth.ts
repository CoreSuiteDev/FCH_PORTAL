import { createAuthClient } from "better-auth/react"

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: typeof window !== "undefined" ? undefined : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"),
})
