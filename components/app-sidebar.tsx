"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IdCardLanyard ,Flag, LayoutDashboard,FolderCode, ShieldCheck , ShoppingCart ,CreditCard, ListIcon,PackageSearch, ChartBarIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, CommandIcon } from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
       <LayoutDashboard />
      ),
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: (
        <ChartBarIcon
        />
      ),
    },{
      title: "Managers",
      url: "/dashboard/managers",
      icon: (
        <ShieldCheck />
      ),
    },
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: (
        <IdCardLanyard />
      ),
    },
    {
      title: "Clients",
      url: "/dashboard/clients",
      icon: (
        <UsersIcon/>
      ),
    }
  ],
  navClouds: [
    {
      title: "Capture",
      icon: (
        <CameraIcon
        />
      ),
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: (
        <FileTextIcon
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: (
        <FileTextIcon
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Get Help",
      url: "https://www.derradjiamine.me",
      icon: (
        <FolderCode />
      ),
    }
  ],
  documents: [
    {
      name: "products",
      url: "/dashboard/products",
      icon: (
        <PackageSearch /> 
      ),
    },
      {
      name: "orders",
      url: "/dashboard/orders",
      icon: (
        <ShoppingCart />
      ),
    },
      {
      name: "payment",
      url: "/dashboard/payments",
      icon: (
        <CreditCard />
      ),
      
    },
    {
      name: "Reports",
      url: "/dashboard/reports",
      icon: (
        <Flag />
      ),
    },
   
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-white text-black" collapsible="offcanvas" {...props}>
      <SidebarHeader className="bg-white text-black">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold text-black">CoreLink System</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="text-black">
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="text-black">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}