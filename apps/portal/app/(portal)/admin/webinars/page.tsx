import React from "react"
import WebinarManager from "./_components/webinars-manager"
import AddWebinarForm from "./_components/add-webinars"

const webinars = () => {
  return (
    <div>
      <WebinarManager />
      <AddWebinarForm />
    </div>
  )
}

export default webinars
