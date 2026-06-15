import React from "react"
import UserMatrics from "./_components/user-matrics"
import UserTable from "./_components/user-table"

const page = () => {
  return (
    <div className="p-6">
      <UserMatrics />
      <UserTable />
    </div>
  )
}

export default page
