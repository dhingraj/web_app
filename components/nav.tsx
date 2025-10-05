
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Siren, Settings, BarChart, Smartphone, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const links = [
  {
    href: "/home",
    label: "Home",
    icon: LayoutDashboard,
  },
    {
    href: "/devices",
    label: "Devices",
    icon: Smartphone,
  },
  {
    href: "/alerts",
    label: "Alerts",
    icon: Siren,
  },
  {
    href: "/analytics",
    label: "Analytics & Reports",
    icon: BarChart,
  },
   {
    href: "/scheduling",
    label: "Scheduling",
    icon: CalendarDays,
  },
  {
    href: "/admin",
    label: "Admin",
    icon: Settings,
  },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(link.href)}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
