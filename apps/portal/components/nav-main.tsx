"use client"

import { Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url

            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} className="w-full" scroll={false}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    className={`w-full transition-colors ${
                      isActive
                        ? "bg-primary text-white hover:bg-primary hover:text-white"
                        : "hover:bg-accent hover:text-primary"
                    }`}
                  >
                    {item.icon && <item.icon />}
                    <span className="text-sm font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
