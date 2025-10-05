import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Nav } from "./nav"
import { UserNav } from "./user-nav"
import { cn } from "@/lib/utils";


export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
            <span className={cn("text-lg font-semibold font-headline", "group-data-[collapsible=icon]:hidden")}>HalconX Analytics</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <Nav />
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  )
}
