import { NextRequest, NextResponse } from 'next/server';
import { alerts } from '@/lib/data';

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // Disable caching

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const device = searchParams.get('device');

    let filteredAlerts = [...alerts];

    // Filter by severity
    if (severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
    }

    // Filter by status
    if (status) {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
    }

    // Filter by device
    if (device) {
      filteredAlerts = filteredAlerts.filter(alert => alert.device === device);
    }

    // Get alert counts by severity
    const alertCounts = {
      total: filteredAlerts.length,
      critical: filteredAlerts.filter(a => a.severity === 'Critical').length,
      high: filteredAlerts.filter(a => a.severity === 'High').length,
      medium: filteredAlerts.filter(a => a.severity === 'Medium').length,
      low: filteredAlerts.filter(a => a.severity === 'Low').length,
    };

    // Get alert counts by status
    const statusCounts = {
      new: filteredAlerts.filter(a => a.status === 'New').length,
      acknowledged: filteredAlerts.filter(a => a.status === 'Acknowledged').length,
      resolved: filteredAlerts.filter(a => a.status === 'Resolved').length,
    };

    return NextResponse.json({
      alerts: filteredAlerts,
      counts: {
        bySeverity: alertCounts,
        byStatus: statusCounts,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, severity, device } = body;

    if (!description || !severity || !device) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newAlert = {
      id: `ALERT-${Date.now()}`,
      description,
      severity,
      status: 'New' as const,
      timestamp: new Date().toISOString(),
      device,
    };

    // In a real app, you'd save to database here
    // For now, we'll just return the created alert
    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}
