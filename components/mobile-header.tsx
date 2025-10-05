"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function MobileHeader() {
  const isMobile = useIsMobile()

  if (!isMobile) {
    return null
  }

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <SidebarTrigger />
      <h1 className="text-lg font-semibold font-headline">HalconX Analytics</h1>
      <div className="w-7" /> {/* Spacer to center the title */}
    </div>
  )
}
