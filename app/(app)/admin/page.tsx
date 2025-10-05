
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AdminPage() {

  return (
    <div className="flex flex-col h-full">
       <header className="flex items-center gap-4 p-4 sm:p-6 border-b">
         <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Admin</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>User and tenant administration.</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
                <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Content coming soon...</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
