import type { FieldError } from "react-hook-form"

// --- Color Mappings ---

export const STATUS_COLORS: Record<string, string> = {
  UPCOMING:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400",
  ONGOING:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
  COMPLETED:
    "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
  CANCELLED:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400",
}

export const TYPE_COLORS: Record<string, string> = {
  EVENT:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400",
  WEBINAR:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
}

export const VISIBILITY_COLORS: Record<string, string> = {
  PUBLIC:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
  FREE_WEBINAR:
    "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400",
  MEMBER_ONLY:
    "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400",
  PASTORAL_ONLY:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400",
  BOARD_ONLY:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400",
}

// --- Helper Functions ---

export const getErrorMessage = (
  error: FieldError | undefined | null
): string | null => {
  if (!error) return null
  return error.message || null
}

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const formatDateTimeLocal = (
  date: Date | string | null | undefined
): string => {
  if (!date) return ""
  const d = new Date(date)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
