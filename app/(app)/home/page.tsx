

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { kpiData } from "@/lib/data";

type DeviceStatus = "Healthy" | "Warning" | "Critical" | "Offline";

const subplants = [
  "Bravo Bay", "Hotel Sector", "Charlie Works",
  "Alpha Station", "Delta Point", "India Complex",
  "Foxtrot Factory", "Echo Yard", "Gamma Plant"
];

const processFlow = {
  "Manufacturing": [
    { name: "Bravo Bay", area: "Fabrication" },
    { name: "Hotel Sector", area: "Molding" },
    { name: "Charlie Works", area: "Finishing" },
  ],
  "Assembly & QC": [
    { name: "Alpha Station", area: "Assembly" },
    { name: "Delta Point", area: "QC & Testing" },
  ],
  "Logistics & Shipping": [
    { name: "India Complex", area: "Packaging" },
    { name: "Foxtrot Factory", area: "Logistics" },
    { name: "Echo Yard", area: "Warehouse" },
    { name: "Gamma Plant", area: "Shipping" },
  ]
};

const statusIcons: Record<Exclude<DeviceStatus, "Healthy">, { icon: React.ElementType, color: string }> = {
    Offline: { icon: WifiOff, color: "text-gray-500" },
    Warning: { icon: AlertTriangle, color: "text-yellow-500" },
    Critical: { icon: AlertTriangle, color: "text-red-500" },
};

type Device = {
  id: string;
  name: string;
  status: DeviceStatus;
  subplant: string;
  lastCheckin: string;
};

export default async function HomePage() {

  const getStatus = (): DeviceStatus => {
      const rand = Math.random();
      if (rand < 0.1) return "Offline";
      if (rand < 0.2) return "Critical";
      if (rand < 0.4) return "Warning";
      return "Healthy";
  };

  const allDevices: Device[] = Array.from({ length: 1500 }, (_, i) => ({
    id: `DEV-${String(i + 1).padStart(4, '0')}`,
    name: `Sensor Unit ${i + 1}`,
    status: getStatus(),
    subplant: subplants[i % subplants.length],
    lastCheckin: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
  }));

  const importantKPIs = kpiData.filter(kpi => kpi.title === "Alerts Triggered" || kpi.title === "% Uptime");

  const getDeviceHealthBySubplant = (subplantName: string) => {
    if (allDevices.length === 0) {
      return { healthy: 0, warning: 0, critical: 0, offline: 0, total: 0 };
    }
    const devicesInSubplant = allDevices.filter(device => device.subplant === subplantName);
    const healthCounts = devicesInSubplant.reduce((acc, device) => {
        acc[device.status] = (acc[device.status] || 0) + 1;
        return acc;
    }, {} as Record<DeviceStatus, number>);
  
    return {
      healthy: healthCounts.Healthy || 0,
      warning: healthCounts.Warning || 0,
      critical: healthCounts.Critical || 0,
      offline: healthCounts.Offline || 0,
      total: devicesInSubplant.length
    };
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
            {importantKPIs.map((kpi, index) => {
              const cardContent = (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">{kpi.title}</CardTitle>
                        <kpi.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="py-2">
                        <div className="text-3xl font-bold">{kpi.value}</div>
                        <p className="text-sm text-muted-foreground">{kpi.description}</p>
                    </CardContent>
                </Card>
              );

              if (kpi.title === 'Alerts Triggered') {
                return (
                  <Link key={index} href="/alerts" className="hover:bg-accent/50 block rounded-lg transition-colors">
                    {cardContent}
                  </Link>
                )
              }

              return <div key={index}>{cardContent}</div>;
            })}
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Devices by Location</CardTitle>
                <CardDescription>View devices on the plant floor.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 lg:p-8 rounded-lg">
                <div className="flex flex-col md:flex-row gap-8 justify-between">
                  {Object.entries(processFlow).map(([stage, plants]) => (
                    <div key={stage} className="flex-1">
                      <h3 className="text-lg font-semibold text-center mb-4 font-headline">{stage}</h3>
                      <div className="flex flex-col gap-4 items-center">
                        {plants.map((plant) => {
                          const health = getDeviceHealthBySubplant(plant.name);
                          return (
                            <Link key={plant.name} href={`/devices?subplant=${plant.name}`} className="w-full max-w-xs bg-background hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg flex items-center justify-center p-6 h-32 border z-10">
                                <div className="text-center">
                                    <h3 className="font-semibold text-lg">{plant.name}</h3>
                                    <div className="flex justify-center gap-4 mt-2 text-sm">
                                      <div className="flex items-center gap-1">
                                        <CheckCircle className="h-4 w-4 text-green-500"/>
                                        <span>{health.healthy}</span>
                                      </div>
                                      {Object.entries(statusIcons).map(([status, { icon: Icon, color }]) => (
                                          <div key={status} className="flex items-center gap-1">
                                              <Icon className={cn("h-4 w-4", color)} />
                                              <span>{health[status.toLowerCase() as keyof typeof health]}</span>
                                          </div>
                                      ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">{health.total} Total Devices</p>
                                </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
        </Card>

      </main>
    </div>
  );
}
