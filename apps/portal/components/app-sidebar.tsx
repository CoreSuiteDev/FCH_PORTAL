"use client"

import * as React from "react"
import { IconInnerShadowTop } from "@tabler/icons-react"
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
import { data } from "@/constants/dashboard-data"
import Link from "next/link"
import { useSessionInfo } from "@/hooks/use-session-info"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userinfo, isLoading, isError } = useSessionInfo()
  const roles = userinfo?.user?.roles || []

  // navSecondary theke items gulo ke separate/filter kore nilam static title er jonno
  const internalDocs = data.navSecondary.filter((item) =>
    ["General FCH Documents", "Newsletter Archive"].includes(item.title)
  )

  const accountAndHelp = data.navSecondary.filter((item) =>
    ["My Profile", "Settings", "Get Help", "Search"].includes(item.title)
  )

  const sidebarUser = userinfo?.user
    ? {
        name: userinfo.user.name,
        email: userinfo.user.email,
        avatar: userinfo.user.image || "",
      }
    : data.user

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">FCH Portal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* ================= Admin Panel ================= */}
        {(roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")) && (
          <SidebarGroup>
            <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
              Admin Panel
            </SidebarGroupLabel>
            <NavMain items={data.adminMenu} />
          </SidebarGroup>
        )}

        {/* ================= Board Room ================= */}
        {(roles.includes("BOARD") ||
          roles.includes("ADMIN") ||
          roles.includes("SUPER_ADMIN")) && (
          <SidebarGroup>
            <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
              Board Room
            </SidebarGroupLabel>
            <NavMain items={data.boardMenu} />
          </SidebarGroup>
        )}

        {/* ================= Pastoral Resources ================= */}
        {(roles.includes("PASTORAL") ||
          roles.includes("ADMIN") ||
          roles.includes("SUPER_ADMIN")) && (
          <SidebarGroup>
            <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
              Pastoral Resources
            </SidebarGroupLabel>
            <NavMain items={data.pastoralMenu} />
          </SidebarGroup>
        )}

        {/* ================= General Area ================= */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
            General Area
          </SidebarGroupLabel>
          <NavMain items={data.generalMenu} />
        </SidebarGroup>

        {/* ================= Custom Section: FCH Resources ================= */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
            FCH Resources
          </SidebarGroupLabel>
          <NavSecondary items={internalDocs} />
        </SidebarGroup>

        {/* ================= Custom Section: Account & Support ================= */}
        {/* mt-auto deway eta ekdom niche push hoye thakbe */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
            Account & Support
          </SidebarGroupLabel>
          <NavSecondary items={accountAndHelp} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarUser} isLoading={isLoading} isError={isError} />
      </SidebarFooter>
    </Sidebar>
  )
}
