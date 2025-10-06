
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportsPage() {

  return (
    <div className="flex flex-col h-full">
       <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>On-demand and scheduled, consistent and brandable.</CardDescription>
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
