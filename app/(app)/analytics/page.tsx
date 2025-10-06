
"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download, LayoutDashboard, Siren } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label } from 'recharts';




// Mock data for charts
const subplants = ["Sub-plant A", "Sub-plant B", "Sub-plant C", "Sub-plant D"];
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
  const [view, setView] = useState<"dashboard" | "report">("dashboard");
  const [selectedAxes, setSelectedAxes] = useState<{vx: boolean, vy: boolean, vz: boolean}>({vx: true, vy: true, vz: true});
  const [subplantFilter, setSubplantFilter] = useState("all");
  const [deviceIdFilter, setDeviceIdFilter] = useState("");
  const [selectedNode, setSelectedNode] = useState("Node 1");
  const [liveData, setLiveData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleRefreshData = () => {
    fetchLiveData();
  };

  // Fetch data on component mount and set up polling
  React.useEffect(() => {
    fetchLiveData();
    
    // Poll every 15 minutes for live updates
    const interval = setInterval(fetchLiveData, 900000);
    
    return () => clearInterval(interval);
  }, []);

  // Process live data for charts
  const processedData = React.useMemo(() => {
    if (!liveData.length) return { temperatureData: [], humidityData: [], pressureData: [] };
    
    // Sort by timestamp and take the last 20 readings
    const sortedData = liveData
      .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
      .slice(-20);
    
    const temperatureData = sortedData.map(item => ({
      time: new Date(item.ts).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      temperature: item.temp
    }));
    
    const humidityData = sortedData.map(item => ({
      time: new Date(item.ts).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      humidity: item.humidity
    }));
    
    const pressureData = sortedData.map(item => ({
      time: new Date(item.ts).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      pressure: item.pressure
    }));
    
    return {
      temperatureData,
      humidityData,
      pressureData
    };
  }, [liveData]);

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-8">
        
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Sub-plant</label>
                <Select value={subplantFilter} onValueChange={setSubplantFilter}>
                    <SelectTrigger>
                    <SelectValue placeholder="All Sub-plants" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Sub-plants</SelectItem>
                    {subplants.map((subplant) => (
                      <SelectItem key={subplant} value={subplant}>
                        {subplant}
                      </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
              <div>
                <label className="text-sm font-medium">Asset ID</label>
                <Input
                  placeholder="Search by Asset ID..."
                  value={deviceIdFilter}
                  onChange={(e) => setDeviceIdFilter(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleRefreshData} disabled={loading}>
                  {loading ? "Loading..." : "Refresh Data"}
                </Button>
                  <Button variant="outline" onClick={() => setView(view === 'dashboard' ? 'report' : 'dashboard')}>
                    {view === 'dashboard' ? <Eye className="mr-2 h-4 w-4" /> : <LayoutDashboard className="mr-2 h-4 w-4" />}
                    {view === 'dashboard' ? 'View Report' : 'View Dashboard'}
                  </Button>
              </div>
                </div>
            </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 p-0">
                {view === 'dashboard' ? (
                    <div className="p-6 space-y-6">
                        {/* Node Selection Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {["Node 1", "Node 2", "Node 3", "Node 4", "Node 5"].map((node) => (
                                <Button 
                                    key={node}
                                    variant={selectedNode === node ? "default" : "outline"}
                                    className={selectedNode === node 
                                        ? "bg-blue-600 hover:bg-blue-700" 
                                        : "border-gray-300 hover:bg-gray-50"
                                    }
                                    onClick={() => setSelectedNode(node)}
                                >
                                    {node}
                                </Button>
                            ))}
                        </div>

                        {/* Alert Summary Card */}
                        <Card className="border-orange-200 bg-orange-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-orange-800">
                                    <Siren className="h-5 w-5" />
                                    Alert Summary - {selectedNode}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-orange-900 mb-2">Active Alerts</h4>
                                        <div className="space-y-2">
                                            {selectedNode === "Node 1" && (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                        <span className="text-sm">High Vibration Detected</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                        <span className="text-sm">Temperature Threshold Exceeded</span>
                                                    </div>
                                                </>
                                            )}
                                            {selectedNode === "Node 2" && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-sm">All systems normal</span>
                                                </div>
                                            )}
                                            {selectedNode === "Node 3" && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    <span className="text-sm">Pressure fluctuation detected</span>
                                                </div>
                                            )}
                                            {selectedNode === "Node 4" && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-sm">All systems normal</span>
                                                </div>
                                            )}
                                            {selectedNode === "Node 5" && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    <span className="text-sm">Motor bearing wear detected</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-orange-900 mb-2">Recommended Actions</h4>
                                        <div className="space-y-2">
                                            {selectedNode === "Node 1" && (
                                                <>
                                                    <div className="text-sm text-orange-800">
                                                        • Schedule vibration analysis
                                                    </div>
                                                    <div className="text-sm text-orange-800">
                                                        • Check cooling system
                                                    </div>
                                                    <div className="text-sm text-orange-800">
                                                        • Review frequency spectrum patterns
                                                    </div>
                                                </>
                                            )}
                                            {selectedNode === "Node 2" && (
                                                <div className="text-sm text-green-700">
                                                    • Continue routine monitoring
                                                </div>
                                            )}
                                            {selectedNode === "Node 3" && (
                                                <div className="text-sm text-orange-800">
                                                    • Investigate pressure source
                                                </div>
                                            )}
                                            {selectedNode === "Node 4" && (
                                                <div className="text-sm text-green-700">
                                                    • Continue routine monitoring
                                                </div>
                                            )}
                                            {selectedNode === "Node 5" && (
                                                <div className="text-sm text-orange-800">
                                                    • Schedule bearing replacement
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Frequency Spectrum Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Frequency Spectrum</CardTitle>
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
                                <div className="pb-4">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <LineChart data={frequencySpectrumData}>
                                        <XAxis 
                                            dataKey="frequency" 
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
                                    <div className="text-center text-sm text-muted-foreground mt-2">
                                        Frequency (Hz)
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Temperature and Magnetic Field Charts */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Temperature
                                        {processedData.temperatureData.length > 0 && (
                                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                ({processedData.temperatureData[processedData.temperatureData.length - 1].temperature}°C)
                                            </span>
                                        )}
                                    </CardTitle>
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
                                                />
                                                <YAxis 
                                                    label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                                                />
                                                <Tooltip />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="temperature" 
                                                    stroke="#ef4444" 
                                                    strokeWidth={2} 
                                                    name="Temperature (°C)"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Magnetic Field
                                        {magneticFieldData.length > 0 && (
                                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                ({magneticFieldData[magneticFieldData.length - 1].magneticField} μT)
                                            </span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={magneticFieldData}>
                                            <XAxis 
                                                dataKey="time" 
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
                                    <CardTitle>
                                        Pressure
                                        {processedData.pressureData.length > 0 && (
                                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                ({processedData.pressureData[processedData.pressureData.length - 1].pressure} hPa)
                                            </span>
                                        )}
                                    </CardTitle>
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
                                    <CardTitle>
                                        Humidity
                                        {processedData.humidityData.length > 0 && (
                                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                ({processedData.humidityData[processedData.humidityData.length - 1].humidity}%)
                                            </span>
                                        )}
                                    </CardTitle>
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
