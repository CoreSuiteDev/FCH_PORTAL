import type { FieldError } from "react-hook-form"

export const STATUS_COLORS: Record<string, string> = {
  DRAFT:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  REVIEW:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
  SCHEDULED:
    "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400",
  PUBLISHED:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
  ARCHIVED:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400",
}

export const TYPE_COLORS: Record<string, string> = {
  NEWS: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400",
  BLOG: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400",
  ANNOUNCEMENT:
    "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-400",
}

export const getErrorMessage = (error: FieldError | undefined | null): string | null => {
  if (!error) return null
  return error.message || null
}
