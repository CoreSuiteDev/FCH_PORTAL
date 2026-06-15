import React from "react"
import EventsManager from "./_components/event-manager"
import AddEventForm from "./_components/add-new-event"

const Event = () => {
  return (
    <div>
      <EventsManager />
      <AddEventForm />
    </div>
  )
}

export default Event
