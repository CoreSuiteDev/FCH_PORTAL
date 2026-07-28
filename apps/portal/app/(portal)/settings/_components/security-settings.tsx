"use client"

import React, { useState } from "react"
import { IconLock, IconLoader, IconShieldCheck, IconEye, IconEyeOff } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/sonner"
import { authClient } from "@/lib/auth"

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required.")
      return
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.")
      return
    }

    try {
      setIsUpdating(true)
      const { error } = await authClient.changePassword({
        newPassword: newPassword,
        currentPassword: currentPassword,
        revokeOtherSessions: true,
      })

      if (error) {
        throw new Error(error.message || "Failed to update password.")
      }

      toast.success("Password updated successfully.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err.message || "Failed to update password. Verify your current password.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xs space-y-6">
      <h3 className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3 text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
        <IconLock className="size-5 text-slate-500" /> Change Password
      </h3>

      <form onSubmit={handleUpdatePassword} className="space-y-4">
        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Current Password
          </label>
          <div className="relative">
            <Input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="h-10 border-slate-200 dark:border-slate-800 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showCurrent ? <IconEyeOff className="size-4.5" /> : <IconEye className="size-4.5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            New Password
          </label>
          <div className="relative">
            <Input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="h-10 border-slate-200 dark:border-slate-800 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showNew ? <IconEyeOff className="size-4.5" /> : <IconEye className="size-4.5" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="h-10 border-slate-200 dark:border-slate-800 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showConfirm ? <IconEyeOff className="size-4.5" /> : <IconEye className="size-4.5" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-3">
          <Button
            type="submit"
            disabled={isUpdating}
            className="bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold px-4 py-2 cursor-pointer h-9"
          >
            {isUpdating ? (
              <>
                <IconLoader className="mr-2 size-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                <IconShieldCheck className="mr-2 size-4" />
                Update Password
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
