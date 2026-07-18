"use client"

import * as React from "react"
import {
  IconInnerShadowTop,
  IconFileText,
  IconBooks,
  IconSchool,
  IconAward,
  IconBriefcase,
  IconHierarchy,
  IconDashboard,
  IconCalendarEvent,
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

  // Dynamically build resource menu items under FCH Resources
  const resourcesMenu = []

  // Add Basic Resources (accessible to all members)
  resourcesMenu.push({
    title: "Basic Resources",
    url: "/portal/resources/basic",
    icon: IconFileText,
  })

  // If user has higher privileges, add the other resource libraries
  if (
    roles.includes("PASTORAL") ||
    roles.includes("BOARD") ||
    roles.includes("ADMIN") ||
    roles.includes("SUPER_ADMIN")
  ) {
    resourcesMenu.push(
      {
        title: "Learning Library",
        url: "/portal/resources/learning",
        icon: IconBooks,
      },
      {
        title: "Catechetical Tools",
        url: "/portal/resources/catechetical",
        icon: IconSchool,
      },
      {
        title: "Pastoral Leadership",
        url: "/portal/resources/leadership",
        icon: IconAward,
      },
      {
        title: "Ministry Toolkits",
        url: "/portal/resources/toolkits",
        icon: IconBriefcase,
      },
      {
        title: "Parish & Diocese Resources",
        url: "/portal/resources/ministry",
        icon: IconHierarchy,
      },
      {
        title: "Special Pastoral Resources",
        url: "/portal/resources/special",
        icon: IconFileText,
      }
    )
  }

  // Include the original internalDocs
  resourcesMenu.push(...internalDocs)

  // Dynamically build pastoral menu items
  const pastoralMenuItems = [
    {
      title: "Pastoral Overview",
      url: "/portal/pastoral",
      icon: IconDashboard,
    },
    {
      title: "Events & Webinars",
      url: "/portal/events",
      icon: IconCalendarEvent,
    },
  ]

  const supportItems = data.navSecondary.filter((item) =>
    ["Get Help", "Search"].includes(item.title)
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
                <IconInnerShadowTop className="size-5! shrink-0" />
                <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
                  FCH Portal
                </span>
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

        {/* ================= Pastoral Area ================= */}
        {(roles.includes("PASTORAL") ||
          roles.includes("ADMIN") ||
          roles.includes("SUPER_ADMIN")) && (
          <SidebarGroup>
            <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
              Pastoral Area
            </SidebarGroupLabel>
            <NavMain items={pastoralMenuItems} />
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
          <NavSecondary items={resourcesMenu} />
        </SidebarGroup>

        {/* ================= Custom Section: Support ================= */}
        {/* mt-auto deway eta ekdom niche push hoye thakbe */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="mb-1 px-2 text-sm font-bold tracking-wider text-sidebar-foreground/90 uppercase">
            Support
          </SidebarGroupLabel>
          <NavSecondary items={supportItems} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarUser} isLoading={isLoading} isError={isError} />
      </SidebarFooter>
    </Sidebar>
  )
}
