import axios from "axios"

export const api = axios.create({
  baseURL:
    typeof window !== "undefined"
      ? "/api/v1"
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})
