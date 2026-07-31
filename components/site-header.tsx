"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/managers": "Managers",
  "/dashboard/employees": "Employees",
  "/dashboard/clients": "Clients",
  "/dashboard/products": "Products",
  "/dashboard/orders": "Orders",
  "/dashboard/payments": "Payments",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
}

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname]

  // Fallback: derive from the last path segment (handles nested routes like /dashboard/clients/123)
  const segments = pathname.split("/").filter(Boolean)
  const last = segments[segments.length - 1]
  if (!last) return "Dashboard"
  return last.charAt(0).toUpperCase() + last.slice(1)
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="flex bg-slate-900 h-(--header-height) mt-0 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex bg-slate-900 w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 bg-white" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <h1 className="text-base font-medium text-sky-400">{title}</h1>
      </div>
    </header>
  )
}