
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, WifiOff } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const devicePerformanceData = [
  { time: '00:00', temperature: 24.5, humidity: 45, pressure: 1013.2, vibration: 0.2 },
  { time: '04:00', temperature: 23.8, humidity: 48, pressure: 1012.8, vibration: 0.3 },
  { time: '08:00', temperature: 25.2, humidity: 42, pressure: 1014.1, vibration: 0.1 },
  { time: '12:00', temperature: 26.8, humidity: 38, pressure: 1013.9, vibration: 0.4 },
  { time: '16:00', temperature: 27.3, humidity: 35, pressure: 1012.5, vibration: 0.2 },
  { time: '20:00', temperature: 25.9, humidity: 41, pressure: 1013.7, vibration: 0.3 },
];

const deviceHealthData = [
  { name: 'Bravo Bay', healthy: 145, warning: 12, critical: 3, offline: 7 },
  { name: 'Hotel Sector', healthy: 142, warning: 8, critical: 2, offline: 4 },
  { name: 'Charlie Works', healthy: 128, warning: 10, critical: 1, offline: 3 },
  { name: 'Alpha Station', healthy: 175, warning: 8, critical: 2, offline: 4 },
  { name: 'Delta Point', healthy: 125, warning: 6, critical: 1, offline: 2 },
];

const alertTrendData = [
  { month: 'Jan', alerts: 45, resolved: 42 },
  { month: 'Feb', alerts: 52, resolved: 48 },
  { month: 'Mar', alerts: 38, resolved: 35 },
  { month: 'Apr', alerts: 61, resolved: 58 },
  { month: 'May', alerts: 47, resolved: 44 },
  { month: 'Jun', alerts: 39, resolved: 36 },
];

const systemStatusData = [
  { name: 'Online', value: 1483, color: '#10b981' },
  { name: 'Warning', value: 78, color: '#f59e0b' },
  { name: 'Critical', value: 15, color: '#ef4444' },
  { name: 'Offline', value: 24, color: '#6b7280' },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,483</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.1%</span> from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.8%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.2%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">52</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">+8</span> from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+1.5%</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Asset Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Performance Metrics</CardTitle>
              <CardDescription>Real-time sensor data from all assets</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={devicePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#8884d8" strokeWidth={2} name="Temperature (°C)" />
                  <Line type="monotone" dataKey="humidity" stroke="#82ca9d" strokeWidth={2} name="Humidity (%)" />
                  <Line type="monotone" dataKey="pressure" stroke="#ffc658" strokeWidth={2} name="Pressure (hPa)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Asset Health by Location */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Health by Location</CardTitle>
              <CardDescription>Asset status distribution across facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deviceHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="healthy" stackId="a" fill="#10b981" name="Healthy" />
                  <Bar dataKey="warning" stackId="a" fill="#f59e0b" name="Warning" />
                  <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
                  <Bar dataKey="offline" stackId="a" fill="#6b7280" name="Offline" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Alert Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Trends</CardTitle>
              <CardDescription>Monthly alert volume and resolution rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={alertTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="alerts" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Alerts" />
                  <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* System Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>System Status Overview</CardTitle>
              <CardDescription>Current device status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={systemStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {systemStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Status Table */}
        <Card>
          <CardHeader>
            <CardTitle>Real-time Asset Status</CardTitle>
            <CardDescription>Live status updates from all connected assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceHealthData.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {location.healthy} healthy, {location.warning} warning, {location.critical} critical
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.round((location.healthy / (location.healthy + location.warning + location.critical + location.offline)) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Health Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
