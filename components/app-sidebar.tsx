import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Nav } from "./nav"
import { cn } from "@/lib/utils";


export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-2">
            <span className={cn("text-lg font-semibold font-headline", "group-data-[collapsible=icon]:hidden")}>HalconX Analytics</span>
        </div>
        <SidebarTrigger className="h-7 w-7 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:mx-auto" />
      </SidebarHeader>
      <SidebarContent>
        <Nav />
      </SidebarContent>
    </Sidebar>
  )
}
