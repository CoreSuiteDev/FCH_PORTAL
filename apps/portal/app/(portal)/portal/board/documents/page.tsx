"use client"
"use no compiler"

import React from "react"
import {
  IconDownload,
  IconInfoCircle,
  IconShieldLock,
} from "@tabler/icons-react"
import { useResourcesList } from "@/hooks/useResources"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function BoardDocumentsPage() {
  const { data: documents = [], isLoading } = useResourcesList({
    categoryName: "Governance Documents",
  })

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-slate-50/50 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Corporate Governance &amp; Bylaws
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Bylaws, charters, conflict policies, and governance guidelines reserved strictly for the Board.
          </p>
        </div>
      </div>

      {/* NDA warning notice */}
      <div className="rounded-xl border border-red-200 bg-red-500/5 p-4 text-xs text-red-700">
        <div className="flex items-start gap-3">
          <IconInfoCircle className="mt-0.5 size-4.5 shrink-0 text-red-500" />
          <div>
            <h4 className="font-bold text-red-800">
              Confidentiality Notice
            </h4>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              These documents are the sole property of FCH and contain proprietary governance information. Access is restricted to active board members only. Sharing or disseminating these files outside of the Board of Trustees is strictly prohibited.
            </p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3 w-2/3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          ))}
        </div>
      ) : documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3 truncate pr-4">
                <span className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2.5 text-primary shrink-0">
                  <IconShieldLock className="size-5 text-slate-500" />
                </span>
                <div className="truncate">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {doc.fileType.toUpperCase()} Document • Added on {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 cursor-pointer rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 border hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0 shadow-xs"
              >
                <IconDownload className="size-3.5" /> Secure Download
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-2xl bg-white dark:bg-slate-900/50 shadow-inner">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 mb-3">
            <IconShieldLock className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No governance documents found
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            There are currently no board documents or bylaws published in this category.
          </p>
        </div>
      )}
    </div>
  )
}
