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

function FalconLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12c-4 4-8 4-12 0 4-4 8-4 12 0Z" />
      <path d="M22 12c-4 4-8 4-12 0" />
      <path d="M11.5 17.5c-3.5 3.5-7 3.5-9 0" />
      <path d="M11.5 17.5c-3.5 3.5-7 3.5-9 0" />
      <path d="M17 11c1.5-1.5 3-1.5 4 0" />
      <path d="M17 11c1.5-1.5 3-1.5 4 0" />
      <path d="M2 13c3 3 6 3 9 0" />
      <path d="M2 13c3 3 6 3 9 0" />
      <path d="M15 13c3 3 6 3 9 0" />
    </svg>
  );
}

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
            <FalconLogo className="size-8 text-primary" />
            <span className={cn("text-lg font-semibold font-headline", "group-data-[collapsible=icon]:hidden")}>Falcon Analytics</span>
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
