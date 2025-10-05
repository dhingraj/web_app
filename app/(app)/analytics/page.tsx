
"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const subplants = [
  "Bravo Bay", "Hotel Sector", "Charlie Works",
  "Alpha Station", "Delta Point", "India Complex",
  "Foxtrot Factory", "Echo Yard", "Gamma Plant"
];

// Mock data for charts
const frequencySpectrumData = [
  { frequency: 0.1, vx: 0.2, vy: 0.15, vz: 0.18 },
  { frequency: 0.5, vx: 0.8, vy: 0.6, vz: 0.7 },
  { frequency: 1.0, vx: 1.2, vy: 1.0, vz: 1.1 },
  { frequency: 2.0, vx: 0.9, vy: 0.8, vz: 0.85 },
  { frequency: 5.0, vx: 0.4, vy: 0.3, vz: 0.35 },
  { frequency: 10.0, vx: 0.1, vy: 0.08, vz: 0.09 },
  { frequency: 20.0, vx: 0.05, vy: 0.04, vz: 0.045 },
];

const temperatureData = [
  { time: '00:00', temperature: 24.5 },
  { time: '04:00', temperature: 23.8 },
  { time: '08:00', temperature: 25.2 },
  { time: '12:00', temperature: 26.8 },
  { time: '16:00', temperature: 27.3 },
  { time: '20:00', temperature: 25.9 },
];

const magneticFieldData = [
  { time: '00:00', magneticField: 45.2 },
  { time: '04:00', magneticField: 44.8 },
  { time: '08:00', magneticField: 46.1 },
  { time: '12:00', magneticField: 47.3 },
  { time: '16:00', magneticField: 46.9 },
  { time: '20:00', magneticField: 45.7 },
];

const pressureData = [
  { time: '00:00', pressure: 1013.2 },
  { time: '04:00', pressure: 1012.8 },
  { time: '08:00', pressure: 1014.1 },
  { time: '12:00', pressure: 1013.9 },
  { time: '16:00', pressure: 1012.5 },
  { time: '20:00', pressure: 1013.7 },
];

const humidityData = [
  { time: '00:00', humidity: 45 },
  { time: '04:00', humidity: 48 },
  { time: '08:00', humidity: 42 },
  { time: '12:00', humidity: 38 },
  { time: '16:00', humidity: 35 },
  { time: '20:00', humidity: 41 },
];

export default function AnalyticsPage() {
  const [subplantFilter, setSubplantFilter] = useState<string>("all");
  const [deviceIdFilter, setDeviceIdFilter] = useState<string>("");
  const [view, setView] = useState<"dashboard" | "report">("dashboard");
  const [selectedAxes, setSelectedAxes] = useState<{vx: boolean, vy: boolean, vz: boolean}>({vx: true, vy: true, vz: true});
  const [dateFilter, setDateFilter] = useState<string>("24h");
  const [liveData, setLiveData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch live data via Next.js API route (bypasses CORS)
  const fetchLiveData = async () => {
    try {
      setLoading(true);
      console.log('Fetching sensor data via Next.js API...');
      
      const response = await fetch('/api/test-connection');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success && result.data.statusCode === 200) {
        const data = JSON.parse(result.data.body);
        console.log('Parsed data:', data);
        setLiveData(data);
        setLastUpdated(new Date());
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Full error details:', err);
      setError(`Failed to load live data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and set up polling
  React.useEffect(() => {
    fetchLiveData();
    
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchLiveData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Process live data for charts
  const processedData = React.useMemo(() => {
    if (!liveData.length) return { temperatureData: [], humidityData: [], pressureData: [] };
    
    return {
      temperatureData: liveData
        .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
        .slice(-20) // Get last 20 readings
        .map(item => ({
          time: new Date(item.ts).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          temperature: item.temp
        })),
      humidityData: liveData
        .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
        .slice(-20)
        .map(item => ({
          time: new Date(item.ts).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          humidity: item.humidity
        })),
      pressureData: liveData
        .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
        .slice(-20)
        .map(item => ({
          time: new Date(item.ts).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          pressure: item.pressure
        }))
    };
  }, [liveData]);

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
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last 1 Hour</SelectItem>
                      <SelectItem value="6h">Last 6 Hours</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  {lastUpdated && (
                    <div className="text-xs text-muted-foreground">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
                  <Button variant="outline" onClick={fetchLiveData} disabled={loading}>
                    {loading ? 'Loading...' : 'Refresh Data'}
                  </Button>
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
                    <div className="p-6 space-y-6">
                        {/* Frequency Spectrum Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Frequency Spectrum Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="absolute top-4 right-4 z-10 flex gap-2">
                                    <button 
                                        className={`px-3 py-1 rounded text-sm font-medium ${selectedAxes.vx ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-gray-100 text-gray-600 border border-gray-300'}`}
                                        onClick={() => {
                                            const isOnlyVx = selectedAxes.vx && !selectedAxes.vy && !selectedAxes.vz;
                                            if (isOnlyVx) {
                                                setSelectedAxes({vx: true, vy: true, vz: true});
                                            } else {
                                                setSelectedAxes({vx: true, vy: false, vz: false});
                                            }
                                        }}
                                    >
                                        Vx
                                    </button>
                                    <button 
                                        className={`px-3 py-1 rounded text-sm font-medium ${selectedAxes.vy ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-600 border border-gray-300'}`}
                                        onClick={() => {
                                            const isOnlyVy = selectedAxes.vy && !selectedAxes.vx && !selectedAxes.vz;
                                            if (isOnlyVy) {
                                                setSelectedAxes({vx: true, vy: true, vz: true});
                                            } else {
                                                setSelectedAxes({vx: false, vy: true, vz: false});
                                            }
                                        }}
                                    >
                                        Vy
                                    </button>
                                    <button 
                                        className={`px-3 py-1 rounded text-sm font-medium ${selectedAxes.vz ? 'bg-orange-100 text-orange-800 border border-orange-300' : 'bg-gray-100 text-gray-600 border border-gray-300'}`}
                                        onClick={() => {
                                            const isOnlyVz = selectedAxes.vz && !selectedAxes.vx && !selectedAxes.vy;
                                            if (isOnlyVz) {
                                                setSelectedAxes({vx: true, vy: true, vz: true});
                                            } else {
                                                setSelectedAxes({vx: false, vy: false, vz: true});
                                            }
                                        }}
                                    >
                                        Vz
                                    </button>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={frequencySpectrumData}>
                                        <XAxis 
                                            dataKey="frequency" 
                                            label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
                                        />
                                        <YAxis 
                                            label={{ value: 'Amplitude', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                                        />
                                        <Tooltip />
                                        {selectedAxes.vx && <Line type="monotone" dataKey="vx" stroke="#8884d8" strokeWidth={2} name="Vx" />}
                                        {selectedAxes.vy && <Line type="monotone" dataKey="vy" stroke="#82ca9d" strokeWidth={2} name="Vy" />}
                                        {selectedAxes.vz && <Line type="monotone" dataKey="vz" stroke="#ffc658" strokeWidth={2} name="Vz" />}
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Temperature and Magnetic Field Charts */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Temperature Monitoring</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="flex items-center justify-center h-[250px]">
                                            <div className="text-muted-foreground">Loading live data...</div>
                                        </div>
                                    ) : error ? (
                                        <div className="flex items-center justify-center h-[250px]">
                                            <div className="text-red-500">{error}</div>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={processedData.temperatureData}>
                                                <XAxis 
                                                    dataKey="time" 
                                                    label={{ value: 'Time', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
                                                />
                                                <YAxis 
                                                    label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                                                />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temperature (°C)" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Magnetic Field Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={magneticFieldData}>
                                            <XAxis 
                                                dataKey="time" 
                                                label={{ value: 'Time', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
                                            />
                                            <YAxis 
                                                label={{ value: 'Magnetic Field (μT)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                                            />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="magneticField" stroke="#3b82f6" strokeWidth={2} name="Magnetic Field (μT)" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Pressure and Humidity Charts */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pressure Monitoring</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="flex items-center justify-center h-[250px]">
                                            <div className="text-muted-foreground">Loading live data...</div>
                                        </div>
                                    ) : error ? (
                                        <div className="flex items-center justify-center h-[250px]">
                                            <div className="text-red-500">{error}</div>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={processedData.pressureData}>
                                                <XAxis 
                                                    dataKey="time" 
                                                    label={{ value: 'Time', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
                                                />
                                                <YAxis 
                                                    label={{ value: 'Pressure (hPa)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                                                />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="pressure" stroke="#10b981" strokeWidth={2} name="Pressure (hPa)" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Humidity Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="flex items-center justify-center h-[250px]">
                                            <div className="text-muted-foreground">Loading live data...</div>
                                        </div>
                                    ) : error ? (
                                        <div className="flex items-center justify-center h-[250px]">
                                            <div className="text-red-500">{error}</div>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={processedData.humidityData}>
                                                <XAxis 
                                                    dataKey="time" 
                                                    label={{ value: 'Time', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
                                                />
                                                <YAxis 
                                                    label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                                                />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="humidity" stroke="#f59e0b" strokeWidth={2} name="Humidity (%)" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
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
