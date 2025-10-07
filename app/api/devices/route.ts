import { NextRequest, NextResponse } from 'next/server';

// Mock device data - in production, this would come from a database
const generateDevices = () => {
  const subplants = [
    "Bravo Bay", "Hotel Sector", "Charlie Works",
    "Alpha Station", "Delta Point", "India Complex",
    "Foxtrot Factory", "Echo Yard", "Gamma Plant"
  ];

  const getStatus = (): "Healthy" | "Warning" | "Critical" | "Offline" => {
    const rand = Math.random();
    if (rand < 0.1) return "Offline";
    if (rand < 0.2) return "Critical";
    if (rand < 0.4) return "Warning";
    return "Healthy";
  };

  return Array.from({ length: 1500 }, (_, i) => ({
    id: `DEV-${String(i + 1).padStart(4, '0')}`,
    name: `Sensor Unit ${i + 1}`,
    status: getStatus(),
    subplant: subplants[i % subplants.length],
    lastCheckin: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
    type: ['Temperature Sensor', 'Pressure Sensor', 'Vibration Sensor', 'Flow Meter'][i % 4],
    location: {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.0060 + (Math.random() - 0.5) * 0.1,
    },
  }));
};

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // Disable caching

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subplant = searchParams.get('subplant');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let devices = generateDevices();

    // Filter by subplant
    if (subplant) {
      devices = devices.filter(device => device.subplant === subplant);
    }

    // Filter by status
    if (status) {
      devices = devices.filter(device => device.status === status);
    }

    // Filter by type
    if (type) {
      devices = devices.filter(device => device.type === type);
    }

    // Pagination
    const paginatedDevices = devices.slice(offset, offset + limit);

    // Get device counts by status
    const statusCounts = {
      total: devices.length,
      healthy: devices.filter(d => d.status === 'Healthy').length,
      warning: devices.filter(d => d.status === 'Warning').length,
      critical: devices.filter(d => d.status === 'Critical').length,
      offline: devices.filter(d => d.status === 'Offline').length,
    };

    // Get device counts by subplant
    const subplantCounts = devices.reduce((acc, device) => {
      acc[device.subplant] = (acc[device.subplant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get device counts by type
    const typeCounts = devices.reduce((acc, device) => {
      acc[device.type] = (acc[device.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      devices: paginatedDevices,
      pagination: {
        total: devices.length,
        limit,
        offset,
        hasMore: offset + limit < devices.length,
      },
      counts: {
        byStatus: statusCounts,
        bySubplant: subplantCounts,
        byType: typeCounts,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}
