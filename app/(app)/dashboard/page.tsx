
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardPage() {
  const grafanaUrl = "http://localhost:3000/d/fez30pa0i5yiob/iot-test?orgId=1&from=1758816143564&to=1758817492905&theme=light";

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Card className="h-full">
            <CardHeader>
                <CardTitle>IoT Dashboard</CardTitle>
                <CardDescription>Real-time performance and diagnostics from Grafana.</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
                <div className="relative w-full h-full">
                    <iframe 
                        src={grafanaUrl} 
                        className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                        allowFullScreen
                    ></iframe>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
