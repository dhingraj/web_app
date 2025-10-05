import { NextRequest, NextResponse } from 'next/server';

const locations = [
  {
    id: "bravo-bay",
    name: "Bravo Bay",
    area: "Fabrication",
    stage: "Manufacturing",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    deviceCount: 167,
    status: "Operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "hotel-sector",
    name: "Hotel Sector",
    area: "Molding",
    stage: "Manufacturing",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    deviceCount: 156,
    status: "Operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "charlie-works",
    name: "Charlie Works",
    area: "Finishing",
    stage: "Manufacturing",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    deviceCount: 142,
    status: "Operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "alpha-station",
    name: "Alpha Station",
    area: "Assembly",
    stage: "Assembly & QC",
    coordinates: { lat: 40.7614, lng: -73.9776 },
    deviceCount: 189,
    status: "Operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "delta-point",
    name: "Delta Point",
    area: "QC & Testing",
    stage: "Assembly & QC",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    deviceCount: 134,
    status: "Operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "india-complex",
    name: "India Complex",
    area: "Packaging",
    stage: "Logistics & Shipping",
    coordinates: { lat: 40.7282, lng: -73.7949 },
    deviceCount: 178,
    status: "Operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "foxtrot-factory",
    name: "Foxtrot Factory",
    area: "Logistics",
    stage: "Logistics & Shipping",
    coordinates: { lat: 40.6892, lng: -74.0445 },
    deviceCount: 165,
    status: "Operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "echo-yard",
    name: "Echo Yard",
    area: "Warehouse",
    stage: "Logistics & Shipping",
    coordinates: { lat: 40.6782, lng: -73.9442 },
    deviceCount: 201,
    status: "Operational",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "gamma-plant",
    name: "Gamma Plant",
    area: "Shipping",
    stage: "Logistics & Shipping",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    deviceCount: 168,
    status: "Operational",
    lastUpdate: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const status = searchParams.get('status');

    let filteredLocations = [...locations];

    // Filter by stage
    if (stage) {
      filteredLocations = filteredLocations.filter(location => location.stage === stage);
    }

    // Filter by status
    if (status) {
      filteredLocations = filteredLocations.filter(location => location.status === status);
    }

    // Get total device count across all locations
    const totalDevices = filteredLocations.reduce((sum, location) => sum + location.deviceCount, 0);

    // Get device counts by stage
    const stageCounts = filteredLocations.reduce((acc, location) => {
      acc[location.stage] = (acc[location.stage] || 0) + location.deviceCount;
      return acc;
    }, {} as Record<string, number>);

    // Get device counts by area
    const areaCounts = filteredLocations.reduce((acc, location) => {
      acc[location.area] = (acc[location.area] || 0) + location.deviceCount;
      return acc;
    }, {} as Record<string, number>);

    // Get operational status counts
    const statusCounts = filteredLocations.reduce((acc, location) => {
      acc[location.status] = (acc[location.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      locations: filteredLocations,
      summary: {
        totalLocations: filteredLocations.length,
        totalDevices,
        byStage: stageCounts,
        byArea: areaCounts,
        byStatus: statusCounts,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
