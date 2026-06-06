import { User } from "@workspace/types"

const myUser: User = {
  id: "1",
  name: "Masrafi",
  email: "masrafi@example.com",
}

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready! Portal</h1>
          {myUser.name && <p>{myUser.name}</p>}
        </div>
      </div>
    </div>
  )
}
