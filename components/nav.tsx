
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Siren, BarChart, Smartphone, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
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
]

export function Nav() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    // Close mobile sidebar when a link is clicked
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(link.href)}
            tooltip={link.label}
          >
            <Link href={link.href} onClick={handleLinkClick}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
