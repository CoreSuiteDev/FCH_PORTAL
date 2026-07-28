"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSessionInfo } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth"
import { api } from "@/lib/api-client"
import Container from "@/components/shared/container"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/sonner"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  User,
  Mail,
  Shield,
  Settings,
  LogOut,
  ArrowLeft,
  LayoutDashboard,
  CheckCircle2,
  Camera,
  Loader2,
} from "lucide-react"

export default function ProfilePage() {
  const { data, isLoading, refetch } = useSessionInfo()
  const router = useRouter()
  const user = data?.user
  
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && (!data || !data.authenticated)) {
      router.push("/login")
    }
  }, [data, isLoading, router])

  // Sync state with fetched user data
  useEffect(() => {
    if (user?.name) {
      setName(user.name)
    }
    if (user?.image) {
      setAvatar(user.image)
    }
  }, [user])

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
        const base64Data = (reader.result as string).split(",")[1]
        setIsUpdating(true)
        try {
          // 1. Upload to Cloudflare (under 'users' folder)
          const response = await api.post("/upload", {
            base64: base64Data,
            filename: file.name,
            mimetype: file.type,
            folder: "users",
          })

          if (!response.data?.success) {
            throw new Error("Failed to upload avatar to storage")
          }

          const imageUrl = response.data.data.url

          // 2. Update user profile database
          const { error } = await authClient.updateUser({
            image: imageUrl,
          })

          if (error) {
            throw new Error(error.message || "Failed to update profile image")
          }

          setAvatar(imageUrl)
          toast.success("Avatar updated successfully!")
          refetch()
        } catch (err: any) {
          toast.error(err.message || "Something went wrong")
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

    setIsUpdating(true)
    try {
      const { error } = await authClient.updateUser({
        name: name,
      })

      if (error) {
        throw new Error(error.message || "Failed to update profile")
      }

      toast.success("Profile updated successfully!")
      refetch()
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login")
          },
        },
      })
      toast.success("Logged out successfully")
    } catch (err) {
      toast.error("Failed to log out")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12">
        <Container className="max-w-3xl">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Card className="border-slate-100 shadow-sm">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-6">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="space-y-4 pt-6 border-t">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/"
  const roles = user.roles?.map((r) => r.toUpperCase()) || []
  const hasPortalAccess = roles.some((role) =>
    ["GENERAL", "MEMBER", "PASTORAL", "ADMIN", "SUPER_ADMIN", "BOARD"].includes(role)
  )

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      {/* Background Ornaments */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] right-[5%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <Container className="max-w-3xl relative z-10">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-600 hover:text-primary gap-2 pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Sidebar Info Card */}
          <Card className="border-slate-100 shadow-lg md:col-span-4 bg-white rounded-3xl overflow-hidden">
            <div className="bg-primary h-24 w-full relative" />
            <CardContent className="p-6 text-center -mt-12 relative flex flex-col items-center">
              <div
                onClick={handleAvatarClick}
                className="relative h-24 w-24 border-4 border-white shadow-md rounded-full overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer group/avatar flex items-center justify-center shrink-0"
              >
                <Avatar className="h-full w-full">
                  <AvatarImage src={avatar || user.image || ""} alt={user.name} className="object-cover" />
                  <AvatarFallback className="bg-red-50 text-2xl font-bold text-primary flex h-full w-full items-center justify-center">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {/* Camera icon overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                  <Camera className="size-6 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <h2 className="mt-4 font-trajan text-lg font-bold text-slate-800 leading-snug">
                {user.name}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{user.email}</p>

              {/* Roles Badge list */}
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/8 border border-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider"
                  >
                    <Shield className="h-3 w-3" />
                    {role}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="w-full mt-8 space-y-2">
                {hasPortalAccess && (
                  <a
                    href={portalUrl}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/95 text-white py-2.5 text-xs font-bold shadow-sm transition-all hover:shadow-md"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Access Portal
                  </a>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl py-2.5 text-xs font-bold"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings / Edit Card */}
          <Card className="border-slate-100 shadow-lg md:col-span-8 bg-white rounded-3xl">
            <CardHeader className="border-b border-slate-100/80 pb-5">
              <CardTitle className="font-trajan text-xl font-bold text-slate-800 flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Account Settings
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Update your account details and manage profile settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" /> Full Name
                    </label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="rounded-xl border-slate-200 focus-visible:ring-primary focus-visible:border-primary h-11 text-slate-800 text-sm"
                      required
                    />
                  </div>

                  {/* Email Input (ReadOnly) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={user.email}
                        disabled
                        className="rounded-xl border-slate-100 bg-slate-50 text-slate-400 h-11 text-sm cursor-not-allowed pr-10"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200/50 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">
                          Verified
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdating || name.trim() === user.name}
                    className="bg-primary hover:bg-primary/95 text-white rounded-xl shadow-md px-6 py-5 font-bold text-xs uppercase tracking-wider"
                  >
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  )
}
