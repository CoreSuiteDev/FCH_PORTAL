import React from "react"
import { UpcomingMeetings } from "./_components/upcoming-meeting"
import { MeetingTable } from "./_components/meeting-history"
import { MeetingFilters } from "./_components/filter-meeting"

const BoardMeeting = () => {
  return (
    <div className="px-6">
      <UpcomingMeetings />
      <MeetingFilters />
      <MeetingTable />
    </div>
  )
}

export default BoardMeeting
