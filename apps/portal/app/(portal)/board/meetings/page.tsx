"use client"
"use no compiler"

import React, { useState, useMemo } from "react"
import {
  IconCalendarEvent,
  IconClock,
  IconVideo,
  IconPlus,
  IconLoader,
  IconCheck,
  IconX,
  IconShield,
  IconUser,
  IconMessage,
  IconCalendarTime,
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
import { useSessionInfo } from "@/hooks/use-session-info"
import { useUsers } from "@/hooks/useUser"
import {
  useMeetingsList,
  useCreateMeeting,
  useUpdateMeeting,
  useSubmitMeetingRequest,
  useMeetingRequestsList,
  useMyMeetingRequests,
  useUpdateRequestStatus,
  BoardMeeting,
  MeetingRequest,
} from "@/hooks/useMeetings"

export default function BoardMeetingsPage() {
  const { data: session } = useSessionInfo()
  const roles = session?.user?.roles || []
  const isAdmin = roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")

  // Queries
  const { data: meetings, isLoading: isMeetingsLoading } = useMeetingsList()
  const { data: allRequests, isLoading: isAllReqLoading } = useMeetingRequestsList()
  const { data: myRequests, isLoading: isMyReqLoading } = useMyMeetingRequests()
  const { data: boardUsersResponse } = useUsers(1, 100, "", "BOARD")
  const boardUsers = boardUsersResponse?.data || []

  // Mutations
  const createMeetingMutation = useCreateMeeting()
  const updateMeetingMutation = useUpdateMeeting()
  const submitRequestMutation = useSubmitMeetingRequest()
  const updateRequestStatusMutation = useUpdateRequestStatus()

  // State
  const [activeTab, setActiveTab] = useState("meetings")
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null)

  // Meeting Form State
  const [mTitle, setMTitle] = useState("")
  const [mDesc, setMDesc] = useState("")
  const [mDate, setMDate] = useState("")
  const [mDuration, setMDuration] = useState(60)
  const [mLink, setMLink] = useState("")
  const [mType, setMType] = useState<"ONE_TO_ONE" | "ONE_TO_MANY">("ONE_TO_MANY")
  const [mAttendeeIds, setMAttendeeIds] = useState<string[]>([])
  const [linkedRequestId, setLinkedRequestId] = useState<string | undefined>(undefined)

  // Request Form State
  const [rTitle, setRTitle] = useState("")
  const [rReason, setRReason] = useState("")
  const [rDate, setRDate] = useState("")

  // Open Actions
  const handleOpenCreateMeeting = () => {
    setEditingMeetingId(null)
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

  const handleOpenRescheduleMeeting = (meeting: BoardMeeting) => {
    setEditingMeetingId(meeting.id)
    setMTitle(meeting.title)
    setMDesc(meeting.description || "")
    setMDate(meeting.date ? new Date(meeting.date).toISOString().slice(0, 16) : "")
    setMDuration(meeting.duration || 60)
    setMLink(meeting.meetingLink || "")
    setMType(meeting.meetingType)
    setMAttendeeIds(meeting.attendees ? meeting.attendees.map((a) => a.userId) : [])
    setLinkedRequestId(undefined)
    setIsMeetingDialogOpen(true)
  }

  const handleOpenRequestMeeting = () => {
    setRTitle("")
    setRReason("")
    setRDate("")
    setIsRequestDialogOpen(true)
  }

  // --- Submit Actions ---
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
      if (editingMeetingId) {
        await updateMeetingMutation.mutateAsync({
          id: editingMeetingId,
          title: mTitle,
          description: mDesc || undefined,
          date: new Date(mDate).toISOString(),
          duration: Number(mDuration),
          meetingLink: mLink || undefined,
          meetingType: mType,
          attendeeIds: mType === "ONE_TO_ONE" ? mAttendeeIds : undefined,
        })
        toast.success("Board meeting rescheduled successfully!")
      } else {
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
      }
      setIsMeetingDialogOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save meeting details")
    }
  }

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rTitle.trim()) {
      toast.error("Request title is required")
      return
    }
    if (!rReason.trim()) {
      toast.error("Reason is required")
      return
    }
    if (!rDate) {
      toast.error("Please suggest a date and time")
      return
    }

    try {
      await submitRequestMutation.mutateAsync({
        title: rTitle,
        reason: rReason,
        date: new Date(rDate).toISOString(),
      })
      toast.success("Meeting request submitted successfully!")
      setIsRequestDialogOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit request")
    }
  }

  const handleApproveRequest = (req: MeetingRequest) => {
    // Open create meeting dialog pre-filled
    setEditingMeetingId(null)
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

  // Helper date formatting
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
            Board Room Meetings
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Access board schedules, join virtual consultations, and request one-to-one executive briefings.
          </p>
        </div>
        <div className="flex gap-2">
          {!isAdmin && (
            <Button
              onClick={handleOpenRequestMeeting}
              className="bg-primary hover:bg-primary/95 text-white shadow-sm"
            >
              <IconPlus className="mr-2 h-4 w-4" /> Request Meeting
            </Button>
          )}
          {isAdmin && (
            <Button
              onClick={handleOpenCreateMeeting}
              className="bg-primary hover:bg-primary/95 text-white shadow-sm"
            >
              <IconPlus className="mr-2 h-4 w-4" /> Schedule Meeting
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-fit">
          <TabsTrigger value="meetings" className="rounded-lg">
            Scheduled Meetings
          </TabsTrigger>
          <TabsTrigger value="requests" className="rounded-lg">
            Meeting Requests
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

                      {/* Attendee indicators */}
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

                      {/* Launch Link & Actions */}
                      <div className="flex gap-2 mt-4">
                        {meeting.meetingLink ? (
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98"
                          >
                            <IconVideo className="h-4 w-4" />
                            Join Live
                          </a>
                        ) : (
                          <Button
                            disabled
                            variant="secondary"
                            className="flex-1 rounded-xl text-xs font-bold text-slate-400"
                          >
                            No Link
                          </Button>
                        )}
                        {isAdmin && (
                          <Button
                            variant="outline"
                            onClick={() => handleOpenRescheduleMeeting(meeting)}
                            className="flex items-center gap-1.5 rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                            title="Reschedule meeting date and time"
                          >
                            <IconCalendarTime className="h-4 w-4 text-amber-600" />
                            Reschedule
                          </Button>
                        )}
                      </div>
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

        {/* Meeting Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {isAdmin ? "Board Member Consultation Requests" : "Your Consultation Requests"}
              </CardTitle>
              <CardDescription className="text-xs">
                {isAdmin
                  ? "Approve requests to schedule meetings, or reject requests with notes."
                  : "Submit requests for special board briefings, one-to-one consults, or audits."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isAdmin ? (
                isAllReqLoading ? (
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
                                  <IconCheck className="mr-1 h-3.5 w-3.5" /> Approve &amp; Schedule
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectRequest(req.id)}
                                  className="text-red-600 hover:bg-red-50 border-red-200 h-7.5 px-2.5 text-[11px] rounded-lg"
                                >
                                  <IconX className="mr-1 h-3.5 w-3.5" /> Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No consultation requests submitted yet.
                  </div>
                )
              ) : isMyReqLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-10 w-full rounded" />
                  ))}
                </div>
              ) : myRequests && myRequests.length > 0 ? (
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Suggested Topic</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Proposed Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-bold text-slate-800">{req.title}</TableCell>
                        <TableCell className="text-xs text-slate-500 whitespace-pre-wrap">{req.reason}</TableCell>
                        <TableCell className="text-xs text-slate-600">{formatDateTime(req.date)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase border ${
                            req.status === "PENDING"
                              ? "bg-amber-50 text-amber-600 border-amber-200"
                              : req.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-red-50 text-red-600 border-red-200"
                          }`}>
                            {req.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  You have not submitted any meeting requests.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Admin Schedule Meeting Dialog */}
      <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <IconShield className="text-primary h-5 w-5" />
              {editingMeetingId ? "Reschedule Board Meeting" : "Schedule Board Meeting"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMeetingSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Meeting Title *</label>
              <Input
                placeholder="e.g. Q3 Finance Budget Review"
                value={mTitle}
                onChange={(e) => setMTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
              <Textarea
                placeholder="Details of the briefing/consultation..."
                value={mDesc}
                onChange={(e) => setMDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Date &amp; Time *</label>
                <Input
                  type="datetime-local"
                  value={mDate}
                  onChange={(e) => setMDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Duration (Minutes) *</label>
                <Input
                  type="number"
                  min="5"
                  value={mDuration}
                  onChange={(e) => setMDuration(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Meeting Link (Zoom/Meet)</label>
              <Input
                placeholder="https://zoom.us/j/..."
                value={mLink}
                onChange={(e) => setMLink(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Meeting Type *</label>
                <select
                  value={mType}
                  onChange={(e) => {
                    setMType(e.target.value as any)
                    setMAttendeeIds([])
                  }}
                  className="w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="ONE_TO_MANY">General (All Board Members)</option>
                  <option value="ONE_TO_ONE">One-to-One Briefing</option>
                </select>
              </div>

              {mType === "ONE_TO_ONE" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Select Target Board Member *</label>
                  <select
                    value={mAttendeeIds[0] || ""}
                    onChange={(e) => setMAttendeeIds([e.target.value])}
                    required={mType === "ONE_TO_ONE"}
                    className="w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="" disabled>Select board member</option>
                    {boardUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <DialogFooter className="border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMeetingDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMeetingMutation.isPending || updateMeetingMutation.isPending}
                className="bg-primary hover:bg-primary/95 text-white"
              >
                {createMeetingMutation.isPending || updateMeetingMutation.isPending ? (
                  <IconLoader className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                {editingMeetingId ? "Save & Reschedule" : "Schedule Meeting"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Board Member Request Meeting Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <IconMessage className="text-primary h-5 w-5" />
              Request Executive Consultation
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRequestSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Suggested Topic *</label>
              <Input
                placeholder="e.g. FY 2026 Audit Discrepancies Review"
                value={rTitle}
                onChange={(e) => setRTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Reason &amp; Agenda Details *</label>
              <Textarea
                placeholder="Describe why this briefing is needed and details on requested materials..."
                value={rReason}
                onChange={(e) => setRReason(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Suggested Date &amp; Time *</label>
              <Input
                type="datetime-local"
                value={rDate}
                onChange={(e) => setRDate(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRequestDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitRequestMutation.isPending}
                className="bg-primary hover:bg-primary/95 text-white"
              >
                {submitRequestMutation.isPending ? (
                  <IconLoader className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
