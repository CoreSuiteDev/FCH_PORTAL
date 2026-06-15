import { tierSummaries, TierSummary } from "@/constants/manage-users-data"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { ShieldAlert, UserCheck, UserX, Clock } from "lucide-react"
import React from "react"

const UserMatrics = () => {
  const statusStats = [
    {
      name: "Active Accounts",
      count: 24,
      description: "Currently operational",
      color: "bg-emerald-500",
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      name: "Expired Accounts",
      count: 5,
      description: "Membership period ended",
      color: "bg-amber-500",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Suspended Accounts",
      count: 1,
      description: "Restricted by admin",
      color: "bg-red-500",
      icon: <UserX className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {tierSummaries.map((summary: TierSummary, index: number) => (
          <Card
            key={index}
            className={`border-l-4 shadow-sm ${summary.color.replace("bg-", "border-l-")}`}
          >
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${summary.color}`} />
                  <span className="text-sm font-semibold text-slate-700">
                    {summary.name}
                  </span>
                </div>
                <Badge variant="secondary" className="font-mono font-bold">
                  {summary.count}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Distribution</span>
                  <span className="font-medium">{summary.percentage}%</span>
                </div>
                <Progress
                  value={summary.percentage}
                  className={`h-2 ${summary.color.replace("bg-", "[&>div]:bg-")}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statusStats.map((stat, index) => (
          <Card
            key={index}
            className="overflow-hidden shadow-sm transition-all hover:shadow-md"
          >
            <CardContent className="flex items-start gap-4 p-5">
              <div className={`rounded-lg p-3 text-white ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {stat.name}
                  </h3>
                  <span className="text-2xl font-bold text-slate-900">
                    {stat.count}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default UserMatrics
