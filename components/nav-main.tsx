"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CirclePlusIcon, MailIcon } from "lucide-react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup className=" mt-10 ">
      <SidebarGroupContent className="flex flex-col gap-2 ">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url

            return (
              <SidebarMenuItem  key={item.title} className="  text-white">
                <SidebarMenuButton
                  tooltip={item.title}
                  render={<a href={item.url} />}
                  className={isActive ? "bg-[#1E293B] text-sky-400" : "text-slate-400"}
                >
                  {item.icon}
                  <span className={isActive ? " text-sky-400 " : "text-slate-400"}>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}