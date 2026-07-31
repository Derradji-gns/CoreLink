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
import {
  IdCardLanyard,
  Flag,
  LayoutDashboard,
  FolderCode,
  ShieldCheck,
  ShoppingCart,
  CreditCard,
  PackageSearch,
  UsersIcon,
  CameraIcon,
  FileTextIcon,
  Settings2Icon,
  CommandIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()
type Role = "owner" | "manager" | null

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Managers",
      url: "/dashboard/managers",
      icon: <ShieldCheck />,
      ownerOnly: true,
    },
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: <IdCardLanyard />,
    },
    {
      title: "Clients",
      url: "/dashboard/clients",
      icon: <UsersIcon />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <CameraIcon />,
      isActive: true,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Proposal",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Prompts",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "https://www.derradjiamine.me",
      icon: <FolderCode />,
    },
  ],
  documents: [
    {
      name: "products",
      url: "/dashboard/products",
      icon: <PackageSearch />,
    },
    {
      name: "orders",
      url: "/dashboard/orders",
      icon: <ShoppingCart />,
    },
    {
      name: "payment",
      url: "/dashboard/payments",
      icon: <CreditCard />,
      ownerOnly: true,
    },
    {
      name: "Reports",
      url: "/dashboard/reports",
      icon: <Flag />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = React.useState<Role>(null)
  const [userDisplay, setUserDisplay] = React.useState({
    name: "shadcn",
    email: "m@example.com",
    avatar: "/admin.webp",
  })

  React.useEffect(() => {
    let isMounted = true

    async function fetchRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (isMounted) {
        setRole((profile?.role as Role) ?? "manager")
      }
    }

    fetchRole()
    return () => {
      isMounted = false
    }
  }, [])

  React.useEffect(() => {
    let isMounted = true

    async function fetchUserDisplay() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !isMounted) return

      setUserDisplay({
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        email: user.email ?? "",
        avatar: "/admin.webp",
      })
    }

    fetchUserDisplay()
    return () => {
      isMounted = false
    }
  }, [])

  const visibleNavMain = React.useMemo(
    () => data.navMain.filter((item) => !item.ownerOnly || role === "owner"),
    [role]
  )

  const visibleDocuments = React.useMemo(
    () => data.documents.filter((item) => !item.ownerOnly || role === "owner"),
    [role]
  )

  return (
    <Sidebar
      className="bg-[#0F172A] text-[#94A3B8] border-r border-[#1E293B]"
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader className="bg-[#0F172A] text-[#94A3B8] border-b border-[#1E293B]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5 text-[#38BDF8]" />
              <span className="text-base font-semibold text-[#38BDF8]">
                CoreLink System
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-[#0F172A] text-[#94A3B8]">
        <NavMain items={visibleNavMain}  />
        <NavDocuments items={visibleDocuments} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="bg-[#0F172A]">
        <NavUser  user={userDisplay} />
      </SidebarFooter>
    </Sidebar>
  )
}
