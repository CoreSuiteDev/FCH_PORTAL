"use client"
import { useState } from "react"
import {
  IconCalendarEvent,
  IconClock,
  IconPlus,
  IconVideo,
  IconLink,
  IconTrash,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Input } from "@workspace/ui/components/input"
import { useMeetingStore } from "@/store/use-bord-meeting-store"
import { upcomingMeetings } from "@/constants/bord-meeting-data"

export const UpcomingMeetings = () => {
  const { addMeeting, deleteMeeting } = useMeetingStore()

  // State for pagination and dialog
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const itemsPerPage = 4

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    platform: "",
    date: "",
    time: "",
    link: "",
  })

  // Pagination Logic
  const totalPages = Math.ceil(upcomingMeetings.length / itemsPerPage)
  const paginatedData = upcomingMeetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAddMeeting = () => {
    if (!newMeeting.title) return
    addMeeting({ ...newMeeting, id: Date.now().toString() })
    setNewMeeting({ title: "", platform: "", date: "", time: "", link: "" })
    setIsDialogOpen(false) // Auto close dialog
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Upcoming Sessions</h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <IconPlus size={18} /> Schedule New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Meeting Title"
                value={newMeeting.title}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, title: e.target.value })
                }
              />
              <Input
                placeholder="Platform"
                value={newMeeting.platform}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, platform: e.target.value })
                }
              />
              <Input
                placeholder="Meeting Link"
                value={newMeeting.link}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, link: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, date: e.target.value })
                  }
                />
                <Input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, time: e.target.value })
                  }
                />
              </div>
              <Button className="w-full" onClick={handleAddMeeting}>
                Confirm Scheduling
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {paginatedData.map((meeting) => (
          <Card
            key={meeting.id}
            className="relative border-slate-200 transition-all hover:shadow-md"
          >
            {/* Delete Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <IconTrash size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete this meeting.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteMeeting(meeting.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <CardHeader className="pb-2">
              <CardTitle className="text-base">{meeting.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconVideo size={16} /> <span>{meeting.platform}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <IconCalendarEvent size={16} /> <span>{meeting.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <IconLink size={16} />{" "}
                <span className="truncate">{meeting.link}</span>
              </div>
              <Button
                className="mt-2 w-full"
                variant="secondary"
                onClick={() => window.open(meeting.link, "_blank")}
              >
                Join Meeting
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
