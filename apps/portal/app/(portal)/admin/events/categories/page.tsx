"use client"

import React from "react"
import { CategoryManager } from "../_components/category-manager"

export default function AdminEventCategoriesPage() {
  return (
    <div className="min-h-screen flex-1 space-y-6 bg-slate-50/50 p-8 pt-6 dark:bg-slate-900/40 animate-fade-in">
      <CategoryManager />
    </div>
  )
}
