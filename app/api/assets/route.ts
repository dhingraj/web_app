import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching asset data from external API - cache cleared...');
    
        const response = await fetch(`https://8vaw2vaqn7.execute-api.us-east-1.amazonaws.com/stage?t=${Date.now()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Asset data fetched successfully:', data);

    // Parse the body if it's a string
    let assetData;
    if (typeof data.body === 'string') {
      assetData = JSON.parse(data.body);
    } else {
      assetData = data.body || data;
    }

        const response = NextResponse.json(assetData);
        
        // Add cache-busting headers to prevent browser and CDN caching
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        
        return response;
  } catch (error) {
    console.error('Error fetching asset data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset data' },
      { status: 500 }
    );
  }
}
