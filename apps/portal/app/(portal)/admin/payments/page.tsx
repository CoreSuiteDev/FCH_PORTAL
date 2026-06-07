import React from "react"
import { IconCreditCard, IconInfoCircle, IconRefresh } from "@tabler/icons-react"

export default function AdminPaymentsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments & Transactions</h2>
          <p className="text-muted-foreground">
            Track MemberPress payments, Stripe transaction IDs, subscription logs, and refunds.
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
              <li>Stripe Integration: Sync with Stripe charges API or payment logs database.</li>
              <li>Show invoice fields: Transaction ID, Member Name, Amount (USD), Status (Succeeded, Failed, Refunded), Timestamp.</li>
              <li>Refund actions: Implement a refund button that calls the Stripe refund API endpoint and updates membership status.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Payments Table */}
      <div className="rounded-md border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/40 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                {
                  id: "ch_3Mv8x9L2j8K4o1P",
                  name: "John Doe",
                  amount: "$50.00",
                  status: "Succeeded",
                  color: "bg-green-500/10 text-green-500",
                  date: "June 05, 2026",
                },
                {
                  id: "ch_3Mv8y1L2j8K4o9Q",
                  name: "Fr. Robert Davis",
                  amount: "$150.00",
                  status: "Succeeded",
                  color: "bg-green-500/10 text-green-500",
                  date: "June 01, 2026",
                },
                {
                  id: "ch_3Mv8z5L2j8K4o2R",
                  name: "Michael Smith",
                  amount: "$50.00",
                  status: "Failed",
                  color: "bg-red-500/10 text-red-500",
                  date: "May 20, 2026",
                },
              ].map((tx, index) => (
                <tr key={index} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{tx.id}</td>
                  <td className="px-6 py-4 font-semibold">{tx.name}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{tx.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${tx.color}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}