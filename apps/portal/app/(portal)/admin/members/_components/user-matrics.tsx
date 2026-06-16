"use client"
import { tierSummaries, TierSummary } from "@/constants/manage-users-data"
import { UserCheck, UserX, Clock, Plus, CheckCircle2 } from "lucide-react"
import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"

const UserMatrics = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleCreateUser = () => {
    // এখানে আপনার API কল বা Logic হবে
    setIsOpen(false)
    setShowSuccess(true)
  }

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

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
      {/* Header section with Add User button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">User Overview</h2>

        {/* Main Add User Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-primary">
                Add New User
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new user account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="pastoral">Pastoral</SelectItem>
                    <SelectItem value="board">Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="text-center sm:max-w-[300px]">
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="rounded-full bg-emerald-100 p-3">
                <CheckCircle2 className="h-10 w-10 animate-in text-emerald-600 duration-300 zoom-in" />
              </div>
              <div className="space-y-1">
                <DialogTitle>Success!</DialogTitle>
                <DialogDescription>
                  The user has been created successfully.
                </DialogDescription>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
