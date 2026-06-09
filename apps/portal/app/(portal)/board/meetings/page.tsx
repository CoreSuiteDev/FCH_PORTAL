"use client"

import React from "react"
import {
  IconDownload,
  IconFileText,
  IconCalendarPlus,
  IconEdit,
  IconTrash,
  IconCalendarEvent,
  IconClock,
} from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

export default function BoardMeetingsAdminPage() {
  return (
    <div className="min-h-screen flex-1 space-y-8 bg-slate-50/50 p-8 pt-6">
      {/* Header with Admin Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Board Governance
          </h2>
          <p className="text-muted-foreground">
            Administer board meetings, agendas, and historical archives.
          </p>
        </div>
        <Button className="gap-2">
          <IconCalendarPlus size={18} /> Schedule New Meeting
        </Button>
      </div>

      {/* Upcoming Meetings Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">
                  Q3 Board Strategy & Audit
                </h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <IconCalendarEvent size={16} /> Sept 10, 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <IconClock size={16} /> 10:00 AM
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <IconEdit size={18} />
                </Button>
                <Button variant="outline" size="sm">
                  Manage Agenda
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Archive Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-base">Meeting History Archive</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {[
              {
                title: "Q2 Annual Planning Session",
                date: "June 02, 2026",
                status: "Published",
              },
              {
                title: "Q1 Financial Review",
                date: "March 05, 2026",
                status: "Published",
              },
            ].map((meeting, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <IconFileText className="text-slate-400" size={24} />
                  <div>
                    <p className="font-medium text-slate-900">
                      {meeting.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {meeting.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{meeting.status}</Badge>
                  <Button variant="outline" size="sm" className="gap-2">
                    <IconDownload size={14} /> Download
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600">
                    <IconTrash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
