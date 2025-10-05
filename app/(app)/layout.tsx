import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset>
            <MobileHeader />
            {children}
        </SidebarInset>
    </SidebarProvider>
  )
}
