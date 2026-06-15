import React from "react"
import ManageUsers from "./_components/manage-user"
import UserMatrics from "./_components/user-matrics"
import MembershipStatus from "./_components/membership-status"
import UserTable from "./_components/user-table"

const page = () => {
  return (
    <div className="p-6">
      <UserMatrics />
      {/* <MembershipStatus /> */}
      <UserTable />
    </div>
  )
}

export default page
