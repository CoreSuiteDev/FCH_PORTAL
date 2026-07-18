"use client"
"use no compiler"

import React, { useState } from "react"
import {
  IconCalendarEvent,
  IconClock,
  IconVideo,
  IconPlus,
  IconCheck,
  IconX,
  IconUser,
} from "@tabler/icons-react"
import { toast } from "@workspace/ui/components/sonner"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { useUsers } from "@/hooks/useUser"
import {
  useMeetingsList,
  useCreateMeeting,
  useMeetingRequestsList,
  useUpdateRequestStatus,
  MeetingRequest,
} from "@/hooks/useMeetings"

export default function AdminBoardMeetingsPage() {
  // Queries
  const { data: meetings, isLoading: isMeetingsLoading } = useMeetingsList()
  const { data: allRequests, isLoading: isAllReqLoading } = useMeetingRequestsList()
  const { data: boardUsersResponse } = useUsers(1, 100, "", "BOARD")
  const boardUsers = boardUsersResponse?.data || []

  // Mutations
  const createMeetingMutation = useCreateMeeting()
  const updateRequestStatusMutation = useUpdateRequestStatus()

  // State
  const [activeTab, setActiveTab] = useState("meetings")
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false)

  // Meeting Form State
  const [mTitle, setMTitle] = useState("")
  const [mDesc, setMDesc] = useState("")
  const [mDate, setMDate] = useState("")
  const [mDuration, setMDuration] = useState(60)
  const [mLink, setMLink] = useState("")
  const [mType, setMType] = useState<"ONE_TO_ONE" | "ONE_TO_MANY">("ONE_TO_MANY")
  const [mAttendeeIds, setMAttendeeIds] = useState<string[]>([])
  const [linkedRequestId, setLinkedRequestId] = useState<string | undefined>(undefined)

  const handleOpenCreateMeeting = () => {
    setMTitle("")
    setMDesc("")
    setMDate("")
    setMDuration(60)
    setMLink("")
    setMType("ONE_TO_MANY")
    setMAttendeeIds([])
    setLinkedRequestId(undefined)
    setIsMeetingDialogOpen(true)
  }

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mTitle.trim()) {
      toast.error("Meeting title is required")
      return
    }
    if (!mDate) {
      toast.error("Please select a date and time")
      return
    }

    try {
      await createMeetingMutation.mutateAsync({
        title: mTitle,
        description: mDesc || undefined,
        date: new Date(mDate).toISOString(),
        duration: Number(mDuration),
        meetingLink: mLink || undefined,
        meetingType: mType,
        attendeeIds: mType === "ONE_TO_ONE" ? mAttendeeIds : undefined,
        requestId: linkedRequestId,
      })
      toast.success("Board meeting scheduled successfully!")
      setIsMeetingDialogOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to schedule meeting")
    }
  }

  const handleApproveRequest = (req: MeetingRequest) => {
    setMTitle(`Meeting: ${req.title}`)
    setMDesc(`Requested by board member. Reason: ${req.reason}`)
    setMDate(new Date(req.date).toISOString().slice(0, 16))
    setMDuration(60)
    setMLink("")
    setMType("ONE_TO_ONE")
    setMAttendeeIds([req.userId])
    setLinkedRequestId(req.id)
    setIsMeetingDialogOpen(true)
  }

  const handleRejectRequest = async (id: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return
    try {
      await updateRequestStatusMutation.mutateAsync({ id, status: "REJECTED" })
      toast.success("Request rejected successfully")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update request status")
    }
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Board Meeting Manager
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Schedule executive board meetings, manage consultation requests, and track general schedules.
          </p>
        </div>
        <div>
          <Button
            onClick={handleOpenCreateMeeting}
            className="bg-primary hover:bg-primary/95 text-white shadow-sm"
          >
            <IconPlus className="mr-2 h-4 w-4" /> Schedule New Meeting
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-fit">
          <TabsTrigger value="meetings" className="rounded-lg">
            Scheduled Meetings
          </TabsTrigger>
          <TabsTrigger value="requests" className="rounded-lg">
            Meeting Requests Queue
          </TabsTrigger>
        </TabsList>

        {/* Scheduled Meetings Tab */}
        <TabsContent value="meetings" className="space-y-4">
          {isMeetingsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : meetings && meetings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting) => {
                const isUpcoming = new Date(meeting.date).getTime() > Date.now()
                return (
                  <Card
                    key={meeting.id}
                    className={`relative flex flex-col justify-between border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 ${
                      !isUpcoming ? "opacity-75" : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider border ${
                            meeting.meetingType === "ONE_TO_ONE"
                              ? "bg-amber-50 text-amber-600 border-amber-200"
                              : "bg-blue-50 text-blue-600 border-blue-200"
                          }`}
                        >
                          {meeting.meetingType === "ONE_TO_ONE" ? "1-on-1 Briefing" : "Board General"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                            isUpcoming ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {isUpcoming ? "Upcoming" : "Past"}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100 mt-2 line-clamp-1">
                        {meeting.title}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-2 min-h-[2.5rem]">
                        {meeting.description || "No meeting briefing details provided."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <IconCalendarEvent className="h-4 w-4 text-primary shrink-0" />
                          <span>{formatDateTime(meeting.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconClock className="h-4 w-4 text-primary shrink-0" />
                          <span>Duration: {meeting.duration} Minutes</span>
                        </div>
                      </div>

                      {meeting.attendees && meeting.attendees.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Attendees ({meeting.attendees.length})
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {meeting.attendees.map((att) => (
                              <div
                                key={att.id}
                                className="inline-flex items-center gap-1 bg-slate-100 border rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                              >
                                <IconUser className="h-3 w-3" />
                                <span className="truncate max-w-[80px]">{att.user.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {meeting.meetingLink ? (
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full mt-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98"
                        >
                          <IconVideo className="h-4 w-4" />
                          Join Live Consultation
                        </a>
                      ) : (
                        <Button
                          disabled
                          variant="secondary"
                          className="w-full mt-4 rounded-xl text-xs font-bold text-slate-400"
                        >
                          No Link Shared Yet
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-2xl bg-white dark:bg-slate-900/50 shadow-inner">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 mb-3">
                <IconCalendarEvent className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                No meetings scheduled
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                There are currently no board meetings or consultations planned.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Meeting Requests Queue Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                Board Member Consultation Requests
              </CardTitle>
              <CardDescription className="text-xs">
                Approve requests to schedule meetings, or reject requests with notes.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isAllReqLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-10 w-full rounded" />
                  ))}
                </div>
              ) : allRequests && allRequests.length > 0 ? (
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Suggested Topic &amp; Reason</TableHead>
                      <TableHead>Suggested Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-bold text-slate-800 dark:text-slate-100">
                          {req.user?.name}
                          <p className="text-[10px] text-slate-400 font-semibold">{req.user?.email}</p>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs sm:max-w-md">
                            <p className="font-bold text-xs text-slate-800">{req.title}</p>
                            <p className="text-xs text-slate-500 mt-1 whitespace-pre-wrap">{req.reason}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {formatDateTime(req.date)}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider border ${
                            req.status === "PENDING"
                              ? "bg-amber-50 text-amber-600 border-amber-200 animate-pulse"
                              : req.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-red-50 text-red-600 border-red-200"
                          }`}>
                            {req.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {req.status === "PENDING" && (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                onClick={() => handleApproveRequest(req)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white h-7.5 px-2.5 text-[11px] rounded-lg"
                              >
                                Approve &amp; Schedule
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRequest(req.id)}
                                className="text-red-600 hover:bg-red-50 border-red-200 h-7.5 px-2.5 text-[11px] rounded-lg"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-slate-450 text-sm">
                  No consultation requests submitted yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Meeting Dialog */}
      <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-800">
              {linkedRequestId ? "Approve & Schedule Meeting" : "Schedule Board Meeting"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMeetingSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Meeting Title
              </label>
              <Input
                placeholder="e.g. Q3 Financial Audit Review"
                value={mTitle}
                onChange={(e) => setMTitle(e.target.value)}
                required
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Briefing Description
              </label>
              <Textarea
                placeholder="Provide briefing agenda or details..."
                value={mDesc}
                onChange={(e) => setMDesc(e.target.value)}
                rows={3}
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Date &amp; Time
                </label>
                <Input
                  type="datetime-local"
                  value={mDate}
                  onChange={(e) => setMDate(e.target.value)}
                  required
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Duration (Minutes)
                </label>
                <Input
                  type="number"
                  value={mDuration}
                  onChange={(e) => setMDuration(Number(e.target.value))}
                  required
                  min={5}
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Video Consultation Link
              </label>
              <Input
                placeholder="Google Meet / Zoom URL"
                value={mLink}
                onChange={(e) => setMLink(e.target.value)}
                type="url"
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Meeting Audience
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="meetingType"
                    checked={mType === "ONE_TO_MANY"}
                    onChange={() => setMType("ONE_TO_MANY")}
                    className="accent-primary"
                  />
                  Board General (All Board Members)
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="meetingType"
                    checked={mType === "ONE_TO_ONE"}
                    onChange={() => setMType("ONE_TO_ONE")}
                    className="accent-primary"
                  />
                  1-on-1 Consultation
                </label>
              </div>
            </div>

            {mType === "ONE_TO_ONE" && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Select Board Member
                </label>
                <select
                  value={mAttendeeIds[0] || ""}
                  onChange={(e) => setMAttendeeIds([e.target.value])}
                  className="w-full border rounded-xl p-2 text-xs bg-white border-slate-200"
                  required={mType === "ONE_TO_ONE"}
                >
                  <option value="">Select a board member...</option>
                  {boardUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMeetingDialogOpen(false)}
                className="rounded-xl border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMeetingMutation.isPending}
                className="bg-primary hover:bg-primary/95 text-white rounded-xl shadow-sm"
              >
                {createMeetingMutation.isPending ? "Scheduling..." : "Schedule Meeting"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
