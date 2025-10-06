
"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Server, WifiOff, BarChart, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type DeviceStatus = "Healthy" | "Warning" | "Critical" | "Offline";

type Device = {
  id: string;
  name: string;
  status: DeviceStatus;
  subplant: string;
  lastCheckin: string;
  reason: string;
};

const subplants = [
  "Bravo Bay", "Hotel Sector", "Charlie Works",
  "Alpha Station", "Delta Point", "India Complex",
  "Foxtrot Factory", "Echo Yard", "Gamma Plant"
];


const statusConfig: Record<DeviceStatus, { icon: React.ElementType, color: string, variant: "default" | "destructive" | "secondary" | "outline" }> = {
    Healthy: { icon: CheckCircle, color: 'text-green-500', variant: 'default' },
    Warning: { icon: AlertTriangle, color: 'text-yellow-500', variant: 'secondary' },
    Critical: { icon: AlertTriangle, color: 'text-red-500', variant: 'destructive' },
    Offline: { icon: WifiOff, color: 'text-gray-500', variant: 'outline' },
};


function DevicesPageContent() {
  const searchParams = useSearchParams();
  const initialSubplantFilter = searchParams.get('subplant') || 'all';

  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [subplantFilter, setSubplantFilter] = useState<string>(initialSubplantFilter);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [openAccordionItem, setOpenAccordionItem] = useState<string | undefined>();

  useEffect(() => {
    const getStatus = (): DeviceStatus => {
        const rand = Math.random();
        if (rand < 0.1) return "Offline";
        if (rand < 0.2) return "Critical";
        if (rand < 0.4) return "Warning";
        return "Healthy";
    };

    const devices = Array.from({ length: 50 }, (_, i) => ({
      id: `DEV-${String(i + 1).padStart(3, '0')}`,
      name: `Sensor Unit ${i + 1}`,
      status: getStatus(),
      subplant: subplants[i % subplants.length],
      lastCheckin: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
      reason: "No connection detected. Last check-in over 24 hours ago.",
    }));
    setAllDevices(devices);
  }, []);

  const filteredDevices = useMemo(() => {
    let devices = allDevices;

    if (subplantFilter !== "all") {
      devices = devices.filter(device => device.subplant === subplantFilter);
    }

    if (searchFilter) {
      devices = devices.filter(device => 
        device.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
        device.name.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    return devices;
  }, [subplantFilter, searchFilter, allDevices]);

  const devicesBySubplant = useMemo(() => {
    return filteredDevices.reduce((acc, device) => {
      if (!acc[device.subplant]) {
        acc[device.subplant] = [];
      }
      acc[device.subplant].push(device);
      return acc;
    }, {} as Record<string, typeof allDevices>);
  }, [filteredDevices]);

  useEffect(() => {
    if (subplantFilter !== "all") {
      setOpenAccordionItem(subplantFilter);
    } else {
      const firstSubplant = Object.keys(devicesBySubplant)[0];
      setOpenAccordionItem(searchFilter ? firstSubplant : undefined);
    }
  }, [subplantFilter, devicesBySubplant, searchFilter]);
  
  useEffect(() => {
    const subplantFromUrl = searchParams.get('subplant');
    if (subplantFromUrl && subplants.includes(subplantFromUrl)) {
      setSubplantFilter(subplantFromUrl);
    }
  }, [searchParams]);

  const handleSubplantFilterChange = (value: string) => {
    setSubplantFilter(value);
  };
  
  const getStatusDetails = (device: Device) => {
    switch (device.status) {
        case 'Offline': return device.reason;
        case 'Critical': return 'Critical alert triggered. Immediate attention required.';
        case 'Warning': return 'Operating outside of normal parameters.';
        case 'Healthy': return 'Device is operating normally.';
        default: return 'Status details not available.';
    }
  }

  const statusOrder: DeviceStatus[] = ["Critical", "Warning", "Offline", "Healthy"];

  const sortDevicesByHealth = (devices: Device[]) => {
    return devices.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
  };


  return (
    <div className="flex flex-col h-full">
       <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={subplantFilter} onValueChange={handleSubplantFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Sub-plant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub-plants</SelectItem>
                  {subplants.map(plant => (
                    <SelectItem key={plant} value={plant}>{plant}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input 
                placeholder="Search by Device ID or Name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Device Inventory</CardTitle>
                <CardDescription>A searchable, filterable inventory with quick health cues.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full" value={openAccordionItem} onValueChange={setOpenAccordionItem}>
                    {Object.entries(devicesBySubplant).map(([subplant, devices]) => (
                        <AccordionItem value={subplant} key={subplant}>
                            <AccordionTrigger className="text-lg font-semibold font-headline hover:no-underline">
                              <div className="flex items-center gap-4">
                                <Server className="h-6 w-6" />
                                <span>{subplant} ({devices.length} devices)</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                                {sortDevicesByHealth(devices).map(device => {
                                    const StatusIcon = statusConfig[device.status].icon;
                                    return (
                                        <Collapsible key={device.id} className="bg-muted/50 rounded-lg">
                                            <div className="p-4 flex items-center justify-between">
                                                <CollapsibleTrigger asChild>
                                                    <button className="flex-1 text-left">
                                                        <p className="font-semibold">{device.name}</p>
                                                        <p className="text-sm text-muted-foreground">{device.id}</p>
                                                    </button>
                                                </CollapsibleTrigger>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <CollapsibleTrigger asChild>
                                                        <Badge variant={statusConfig[device.status].variant} className="flex items-center gap-2 cursor-pointer">
                                                            <StatusIcon className={cn("h-4 w-4", statusConfig[device.status].color)} />
                                                            {device.status}
                                                        </Badge>
                                                    </CollapsibleTrigger>
                                                </div>
                                            </div>
                                            <CollapsibleContent>
                                                <div className="px-4 pb-4 space-y-2">
                                                    <div className="p-3 bg-background rounded-md">
                                                        <p className="font-semibold text-sm">Status Details</p>
                                                        <p className="text-sm text-muted-foreground">{getStatusDetails(device)}</p>
                                                        <p className="text-xs text-muted-foreground/80 mt-2">Last check-in: {new Date(device.lastCheckin).toLocaleString()}</p>
                                                    </div>
                                                    <Link href="/analytics">
                                                      <Button variant="outline" className="w-full">
                                                        <BarChart className="mr-2 h-4 w-4" />
                                                        View Analytics
                                                      </Button>
                                                    </Link>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    )
                                })}
                              </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                {filteredDevices.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        No devices found matching your criteria.
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function DevicesPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <DevicesPageContent />
    </React.Suspense>
  )
}
    
