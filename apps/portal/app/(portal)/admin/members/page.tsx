import React from "react"
import { IconUsers, IconInfoCircle, IconDownload, IconFilter } from "@tabler/icons-react"

export default function AdminMembersPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Members</h2>
          <p className="text-muted-foreground">
            Search, filter, and export the FCH member directory database.
          </p>
        </div>
        <div className="flex shrink-0">
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs">
            <IconDownload className="size-4" /> Export Member List
          </button>
        </div>
      </div>

      {/* Developer Notes / TODO */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
        <div className="flex items-start gap-3">
          <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">Developer TODO Checklist:</h4>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Database Querying: Fetch full user profiles from database.</li>
              <li>Filter implementation: Filter members dynamically by membership level (General, Pastoral, Board) and status (Active, Expired, Canceled, Pending).</li>
              <li>CSV exporter: Integrate a CSV compiler that converts filtered query results into a downloadable file.</li>
              <li>Manage detailed profile: Clicking a row should route to `/admin/members/[id]` to inspect full payment history and status controls.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Members Table */}
      <div className="rounded-md border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/40 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                {
                  name: "John Doe",
                  email: "john.doe@gmail.com",
                  level: "General Member",
                  status: "Active",
                  statusColor: "bg-green-500/10 text-green-500",
                  date: "Jan 12, 2025",
                },
                {
                  name: "Fr. Robert Davis",
                  email: "r.davis@diocese.org",
                  level: "Pastoral Member",
                  status: "Active",
                  statusColor: "bg-green-500/10 text-green-500",
                  date: "Feb 05, 2024",
                },
                {
                  name: "Sarah Jenkins",
                  email: "s.jenkins@fch.org",
                  level: "Board Member",
                  status: "Active",
                  statusColor: "bg-green-500/10 text-green-500",
                  date: "Oct 18, 2023",
                },
                {
                  name: "Michael Smith",
                  email: "m.smith@outlook.com",
                  level: "General Member",
                  status: "Expired",
                  statusColor: "bg-red-500/10 text-red-500",
                  date: "May 20, 2024",
                },
                {
                  name: "Emily Watson",
                  email: "e.watson@catholicacademy.edu",
                  level: "Pastoral Member",
                  status: "Pending Approval",
                  statusColor: "bg-amber-500/10 text-amber-500",
                  date: "June 04, 2026",
                },
              ].map((member, index) => (
                <tr key={index} className="hover:bg-secondary/20 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-semibold">{member.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{member.email}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{member.level}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${member.statusColor}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{member.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}