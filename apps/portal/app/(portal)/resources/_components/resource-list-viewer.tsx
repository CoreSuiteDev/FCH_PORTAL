"use client"
"use no compiler"

import React, { useState, useMemo } from "react"
import {
  IconFileText,
  IconDownload,
  IconSearch,
  IconLock,
  IconBook,
  IconInfoCircle,
} from "@tabler/icons-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { useResourcesList } from "@/hooks/useResources"

interface ResourceListViewerProps {
  categoryName: string
  title: string
  description: string
}

export function ResourceListViewer({
  categoryName,
  title,
  description,
}: ResourceListViewerProps) {
  const { data: resources, isLoading } = useResourcesList({
    categoryName,
  })
  const [searchQuery, setSearchQuery] = useState("")

  // Filter resources matching the current search query
  const filteredResources = useMemo(() => {
    if (!resources) return []
    return resources.filter(
      (r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [resources, searchQuery])

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
            {title}
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            {description}
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <IconSearch className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200 bg-white"
          />
        </div>
      </div>

      {/* Main content area */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                    <IconFileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 border px-2 py-0.5 rounded">
                    {res.fileType}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight line-clamp-1">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {res.description || "No description provided for this resource."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t mt-5 pt-4">
                <span className="text-[10px] text-slate-400">
                  Added {new Date(res.createdAt).toLocaleDateString()}
                </span>
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-primary/95 active:scale-98"
                >
                  <IconDownload className="h-3.5 w-3.5" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-2xl bg-white dark:bg-slate-900/50 shadow-inner">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 mb-3">
            <IconInfoCircle className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No resources found
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            There are currently no resources uploaded for this category matching your role.
          </p>
        </div>
      )}
    </div>
  )
}
