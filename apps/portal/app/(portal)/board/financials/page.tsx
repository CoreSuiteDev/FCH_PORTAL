import React from "react"
import { IconReceipt2, IconInfoCircle, IconLock, IconDownload } from "@tabler/icons-react"

export default function BoardFinancialsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Reports & Audits</h2>
          <p className="text-muted-foreground">
            Confidential financial balance sheets, annual auditing reports, tax disclosures, and treasury records.
          </p>
        </div>
      </div>

      {/* Developer Notes / TODO */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
        <div className="flex items-start gap-3">
          <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">Developer TODO Checklist:</h4>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>MFA requirement: Consider adding a secondary Multi-Factor Authentication prompt before letting members load financial spreadsheets.</li>
              <li>Fetch reports: Pull statements (Form 990, quarterly profit/loss, ledger audits) from database.</li>
              <li>Render interactive charts: Integrate a charting library (Recharts or Chart.js) to display annual income vs expense trends for quick review.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Financial Statements */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Q1 2026 Profit & Loss Ledger",
            period: "Jan - Mar 2026",
            size: "1.4 MB",
            ref: "P&L-2026-Q1",
          },
          {
            title: "2025 Annual Fiscal Audit",
            period: "Full Year 2025",
            size: "4.8 MB",
            ref: "AUDIT-2025-FY",
          },
          {
            title: "FCH Form 990 Tax Declaration",
            period: "Tax Year 2025",
            size: "2.1 MB",
            ref: "IRS-990-2025",
          },
        ].map((report, index) => (
          <div key={index} className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-500">
              <IconLock className="size-3" /> Confidencial
            </div>
            <div>
              <span className="text-xs font-semibold text-primary">{report.period}</span>
              <h4 className="mt-2 font-bold tracking-tight text-base">{report.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">Ref: {report.ref} • PDF File</p>
            </div>
            <div className="mt-5 pt-3 border-t">
              <button className="flex w-full items-center justify-center gap-2 rounded-md bg-secondary border px-3 py-2 text-xs font-semibold hover:bg-secondary/80 transition-colors">
                <IconDownload className="size-4" /> Download Statement
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
