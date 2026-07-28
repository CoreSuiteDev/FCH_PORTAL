"use client"
"use no compiler"

import React from "react"
import { IconDownload, IconFileText, IconLock, IconInfoCircle, IconLoader } from "@tabler/icons-react"
import { useResourcesList } from "@/hooks/useResources"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function BoardFinancialsPage() {
  const { data: financialReports = [], isLoading } = useResourcesList({
    categoryName: "Financial Reports",
    sortOrder: "asc",
  })

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-slate-50/50 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Financial Reports &amp; Audits
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Confidential financial balance sheets, annual auditing reports, tax disclosures, and treasury records.
          </p>
        </div>
      </div>

      {/* Mock warning / NDA notice */}
      <div className="rounded-xl border border-red-200 bg-red-500/5 p-4 text-xs text-red-700">
        <div className="flex items-start gap-3">
          <IconInfoCircle className="mt-0.5 size-4.5 shrink-0 text-red-500" />
          <div>
            <h4 className="font-bold text-red-800">
              Confidentiality Agreement (NDA)
            </h4>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              All materials in this section are highly confidential. Unauthorized downloading, distribution, or reproduction of these financial records is strictly prohibited and subject to FCH governance actions.
            </p>
          </div>
        </div>
      </div>

      {/* Financial Statements */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : financialReports.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {financialReports.map((report) => (
            <div
              key={report.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-red-600">
                <IconLock className="size-3" /> Confidential
              </div>
              
              <div className="space-y-3 pr-20">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl w-fit">
                  <IconFileText className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {report.fileType} Document
                  </span>
                  <h4 className="mt-1 text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    {report.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {report.description || "No description provided for this financial statement."}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
                >
                  <IconDownload className="size-4" /> Download Statement
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-2xl bg-white dark:bg-slate-900/50 shadow-inner">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 mb-3">
            <IconFileText className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No statements uploaded
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            There are currently no financial statements or audits published.
          </p>
        </div>
      )}
    </div>
  )
}
