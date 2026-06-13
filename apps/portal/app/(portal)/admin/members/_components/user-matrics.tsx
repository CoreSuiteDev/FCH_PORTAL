import { tierSummaries, TierSummary } from "@/constants/manage-users-data"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { UserPlus } from "lucide-react"
import React from "react"

const UserMatrics = () => {
  return (
    <div className="py-4">
      {/* HEADER ACTION CONTROL */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Manage Users
          </h1>
          <p className="pt-2 pb-4 text-sm text-slate-500 dark:text-slate-400">
            Monitor, modify roles, and oversee all automated tier accounts and
            status states.
          </p>
        </div>
        <Button
          size="sm"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add New Provision
        </Button>
      </div>

      {/* QUICK METRICS TIER BREAKDOWN */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {tierSummaries.map((summary: TierSummary, index: number) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${summary.color}`} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {summary.name}
                  </span>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {summary.count} Users
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Distribution Ratio</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {summary.percentage}%
                  </span>
                </div>
                <Progress
                  value={summary.percentage}
                  className="h-1.5 [&>div]:bg-green-600"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default UserMatrics
