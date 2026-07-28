"use client"

import { Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@workspace/ui/components/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const hasSubItems = item.items && item.items.length > 0
            const isParentActive =
              pathname === item.url ||
              (item.url === "/" && item.title === "Admin Overview" && ["/", "/admin", "/admin/"].includes(pathname)) ||
              (item.items && item.items.some((sub) => pathname === sub.url))

            return (
              <SidebarMenuItem key={item.title}>
                {hasSubItems ? (
                  <Collapsible
                    defaultOpen={isParentActive}
                    className="group/collapsible"
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isParentActive}
                        className="w-full transition-colors active:bg-primary hover:bg-accent hover:text-primary"
                      >
                        {item.icon && <item.icon />}
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-205 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 border-l border-slate-200">
                        {item.items?.map((subItem) => {
                          const isSubActive = pathname === subItem.url
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubActive}
                                className={`w-full px-3 py-1.5 transition-colors ${
                                  isSubActive
                                    ? "bg-primary! text-white! font-medium hover:bg-primary! hover:text-white!"
                                    : "text-slate-600 hover:text-primary"
                                }`}
                              >
                                <Link href={subItem.url} scroll={false}>
                                  <span className="text-sm">
                                    {subItem.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isParentActive}
                    className={`w-full transition-colors ${
                      isParentActive
                        ? "bg-primary! text-white! hover:bg-primary! hover:text-white!"
                        : "hover:bg-accent hover:text-primary"
                    }`}
                  >
                    <Link href={item.url} scroll={false}>
                      {item.icon && <item.icon />}
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
