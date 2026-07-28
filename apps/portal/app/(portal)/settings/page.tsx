"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { NotificationSettings } from "./_components/notification-settings"
import { SecuritySettings } from "./_components/security-settings"
import { IconLock, IconBell } from "@tabler/icons-react"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 min-h-screen bg-slate-50/50 dark:bg-slate-900/40">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          Portal Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Configure your notification preferences, theme choices, and security options.
        </p>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="security" className="space-y-6 max-w-3xl">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
          <TabsTrigger
            value="security"
            className="rounded-lg py-2 flex items-center justify-center gap-2 cursor-pointer text-xs font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-xs data-[state=active]:text-red-700 dark:data-[state=active]:text-red-400"
          >
            <IconLock className="size-4 shrink-0" />
            <span>Security &amp; Password</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-lg py-2 flex items-center justify-center gap-2 cursor-pointer text-xs font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-xs data-[state=active]:text-red-700 dark:data-[state=active]:text-red-400"
          >
            <IconBell className="size-4 shrink-0" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
