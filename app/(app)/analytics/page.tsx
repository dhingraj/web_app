
"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Download, LayoutDashboard } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const subplants = [
  "Bravo Bay", "Hotel Sector", "Charlie Works",
  "Alpha Station", "Delta Point", "India Complex",
  "Foxtrot Factory", "Echo Yard", "Gamma Plant"
];

export default function AnalyticsPage() {
  const [subplantFilter, setSubplantFilter] = useState<string>("all");
  const [deviceIdFilter, setDeviceIdFilter] = useState<string>("");
  const [view, setView] = useState<"dashboard" | "report">("dashboard");

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
              <BreadcrumbPage>Analytics & Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-8">
        
        <Card>
            <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1">
                <Select value={subplantFilter} onValueChange={setSubplantFilter}>
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
                    placeholder="Search by Device ID..."
                    value={deviceIdFilter}
                    onChange={(e) => setDeviceIdFilter(e.target.value)}
                />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setView(view === 'dashboard' ? 'report' : 'dashboard')}>
                    {view === 'dashboard' ? <Eye className="mr-2 h-4 w-4" /> : <LayoutDashboard className="mr-2 h-4 w-4" />}
                    {view === 'dashboard' ? 'View Report' : 'View Dashboard'}
                  </Button>
                </div>
            </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 p-0">
                {view === 'dashboard' ? (
                    <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">Dashboard content will be displayed here.</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b flex justify-end">
                        <Button>
                          <Download className="mr-2 h-4 w-4" />
                          Download Report
                        </Button>
                      </div>
                      <div className="flex-1 flex items-center justify-center h-full border-2 border-dashed rounded-lg bg-muted/50 m-4">
                          <p className="text-muted-foreground">Report content will be displayed here.</p>
                      </div>
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
