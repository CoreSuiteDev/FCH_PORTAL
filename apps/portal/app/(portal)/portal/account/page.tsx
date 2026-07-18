"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  IconUser,
  IconMail,
  IconShieldCheck,
  IconCamera,
  IconCreditCard,
  IconLock,
  IconLoader,
  IconEdit,
  IconCircleCheck,
} from "@tabler/icons-react"
import { useSessionInfo } from "@/hooks/use-session-info"
import { authClient } from "@/lib/auth"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "@workspace/ui/components/sonner"
import Image from "next/image"

export default function AccountPage() {
  const { data: session, isLoading, refetch } = useSessionInfo()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
      setAvatar(session.user.image || "")
    }
  }, [session])

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
        </div>
      </div>
    )
  }

  const user = session?.user
  const roles = user?.roles || []
  const primaryRole =
    roles.includes("SUPER_ADMIN")
      ? "Super Admin"
      : roles.includes("ADMIN")
        ? "Admin"
        : roles.includes("BOARD")
          ? "Board Member"
          : roles.includes("PASTORAL")
            ? "Pastoral User"
            : roles.includes("MEMBER")
              ? "General Member"
              : "User"

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Avatar size must be less than 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        setAvatar(base64String)
        try {
          setIsUpdating(true)
          const { error } = await authClient.updateUser({
            image: base64String,
          })
          if (error) throw new Error(error.message)
          toast.success("Avatar updated successfully")
          refetch()
        } catch (err: any) {
          toast.error(err.message || "Failed to update avatar")
        } finally {
          setIsUpdating(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Name cannot be empty")
      return
    }

    try {
      setIsUpdating(true)
      const { error } = await authClient.updateUser({
        name: name.trim(),
      })
      if (error) throw new Error(error.message)
      toast.success("Profile details updated successfully")
      refetch()
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 min-h-screen bg-slate-50/50 dark:bg-slate-900/40">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          Account Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your personal identity details, active roles, and billing subscriptions.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Side: Profile Preview Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xs relative overflow-hidden group">
            {/* Background design accents */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-r from-red-700/10 to-rose-600/5 dark:from-red-950/20 dark:to-slate-950" />

            <div className="flex flex-col items-center justify-center relative pt-8 text-center">
              {/* Avatar Uploader Overlay */}
              <div
                onClick={handleAvatarClick}
                className="relative size-24 mb-4 rounded-full border-4 border-white dark:border-slate-950 shadow-md overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer group/avatar"
              >
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={name}
                    fill
                    className="object-cover group-hover/avatar:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <IconUser className="size-10" />
                  </div>
                )}
                {/* Camera icon overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                  <IconCamera className="size-6 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {name || "User Name"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
                <IconMail className="size-3.5" />
                {email || "user@fch.org"}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <IconShieldCheck className="size-3.5" />
                {primaryRole}
              </span>
            </div>

            <div className="mt-6 border-t border-slate-100 dark:border-slate-900 pt-5 space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Account status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <IconCircleCheck className="size-3.5" /> Active
                </span>
              </div>
            </div>
          </div>

          {/* Billing & Subscriptions Card Quick Link */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-600">
                <IconCreditCard className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Billing &amp; Membership
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  View payment statements and cancel subscription plans.
                </p>
              </div>
            </div>
            <Link
              href="/portal/account/membership"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-950 py-2.5 text-xs font-bold transition-colors cursor-pointer"
            >
              Manage Billing Details
            </Link>
          </div>
        </div>

        {/* Right Side: Account Details Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-900 pb-3 mb-6">
              Personal Information
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="h-10 border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    disabled
                    placeholder="user@example.com"
                    className="h-10 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed opacity-75"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Email is managed by administrator/SSO and cannot be self-edited.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-900">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-red-700 hover:bg-red-800 text-white rounded-xl px-5 py-2 h-10 text-xs font-bold cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <IconLoader className="mr-2 size-4 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <IconEdit className="mr-2 size-4" />
                      Update Details
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Password and Security Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <IconLock className="size-4 text-slate-400" /> Account Password
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your authentication credentials or security passwords.
                </p>
              </div>
              <Link
                href="/portal/settings"
                className="inline-flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                Go to Security Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
