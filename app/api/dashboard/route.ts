import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock KPI data - in production, this would come from a database
    const kpiData = {
      activeDevices: 1483,
      totalDevices: 1500,
      uptime: 99.8,
      alertsTriggered: 52,
      criticalAlerts: 10,
      systemHealth: 94.2,
      lastUpdate: new Date().toISOString(),
    };

    // Mock device health by location
    const deviceHealthByLocation = {
      "Bravo Bay": { healthy: 145, warning: 12, critical: 3, offline: 7, total: 167 },
      "Hotel Sector": { healthy: 142, warning: 8, critical: 2, offline: 4, total: 156 },
      "Charlie Works": { healthy: 128, warning: 10, critical: 1, offline: 3, total: 142 },
      "Alpha Station": { healthy: 175, warning: 8, critical: 2, offline: 4, total: 189 },
      "Delta Point": { healthy: 125, warning: 6, critical: 1, offline: 2, total: 134 },
      "India Complex": { healthy: 165, warning: 8, critical: 2, offline: 3, total: 178 },
      "Foxtrot Factory": { healthy: 152, warning: 8, critical: 1, offline: 4, total: 165 },
      "Echo Yard": { healthy: 185, warning: 10, critical: 3, offline: 3, total: 201 },
      "Gamma Plant": { healthy: 155, warning: 8, critical: 2, offline: 3, total: 168 },
    };

    // Mock recent alerts
    const recentAlerts = [
      {
        id: "ALERT-001",
        description: "Motor temperature exceeds 90°C",
        severity: "Critical",
        device: "Motor-A1",
        location: "Bravo Bay",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: "ALERT-002",
        description: "Unusual vibration pattern detected",
        severity: "High",
        device: "Motor-B2",
        location: "Hotel Sector",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
      {
        id: "ALERT-003",
        description: "Device offline for 15 minutes",
        severity: "High",
        device: "Device-C3",
        location: "Charlie Works",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ];

    // Mock system performance metrics
    const performanceMetrics = {
      cpuUsage: 45.2,
      memoryUsage: 67.8,
      diskUsage: 23.1,
      networkLatency: 12.5,
      responseTime: 89.3,
    };

    return NextResponse.json({
      kpis: kpiData,
      deviceHealth: deviceHealthByLocation,
      recentAlerts,
      performance: performanceMetrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
