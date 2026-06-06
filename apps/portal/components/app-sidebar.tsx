"use client"

import * as React from "react"
import {
  IconDashboard,
  IconUsers,
  IconLockSquare,
  IconCreditCard,
  IconCalendarEvent,
  IconVideo,
  IconMail,
  IconPresentation,
  IconFileText,
  IconReceipt2,
  IconHierarchy,
  IconBooks,
  IconSchool,
  IconAward,
  IconBriefcase,
  IconBell,
  IconUser,
  IconInnerShadowTop,
  IconSettings,
  IconHelp,
  IconSearch,
} from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@workspace/ui/components/sidebar"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { data } from "@/constents/deshbord-data"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">FCH Portal</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
            Admin Panel
          </SidebarGroupLabel>
          <NavMain items={data.adminMenu} />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
            Board Room
          </SidebarGroupLabel>
          <NavMain items={data.boardMenu} />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
            Pastoral Resources
          </SidebarGroupLabel>
          <NavMain items={data.pastoralMenu} />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
            General Area
          </SidebarGroupLabel>
          <NavMain items={data.generalMenu} />
        </SidebarGroup>

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
