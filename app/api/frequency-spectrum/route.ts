import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // Disable caching

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching frequency spectrum data from AWS Lambda - cache cleared...');
    console.log('API Version:', new Date().toISOString());
    
    const response = await fetch(`https://cm3jae5goa.execute-api.us-east-1.amazonaws.com/dev?t=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store', // Disable Next.js App Router data cache
      next: { revalidate: 0 }, // Force revalidation on every request
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
        status: response.status
      });
    }

    const data = await response.json();
    console.log('Raw API response structure:', { statusCode: data.statusCode, bodyType: typeof data.body });
    
    // Parse the body string into JSON
    let parsedBody;
    if (typeof data.body === 'string') {
      parsedBody = JSON.parse(data.body);
    } else {
      parsedBody = data.body;
    }
    
    console.log('Parsed body structure:', Object.keys(parsedBody));
    
    // Extract the actual data array
    // The API returns: { data: [...], max_return_rows: X, query_id: Y, rows_returned: Z }
    let frequencyArray;
    if (parsedBody.data && Array.isArray(parsedBody.data)) {
      frequencyArray = parsedBody.data;
      console.log('Successfully extracted frequency data:', frequencyArray.length, 'samples');
    } else if (Array.isArray(parsedBody)) {
      frequencyArray = parsedBody;
      console.log('Body is already an array:', frequencyArray.length, 'samples');
    } else {
      throw new Error('Unexpected API response structure');
    }

    const apiResponse = NextResponse.json({
      success: true,
      data: {
        statusCode: data.statusCode,
        body: frequencyArray // Return the array only
      },
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    // Add comprehensive cache-busting headers to prevent ALL caching
    apiResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private, max-age=0');
    apiResponse.headers.set('Pragma', 'no-cache');
    apiResponse.headers.set('Expires', '0');
    apiResponse.headers.set('Last-Modified', new Date().toUTCString());
    apiResponse.headers.set('ETag', `"${Date.now()}-${Math.random()}"`);
    apiResponse.headers.set('Vary', '*');
    
    return apiResponse;

  } catch (error) {
    console.error('Frequency spectrum fetch failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof TypeError ? 'Network/TypeError' : 'Other'
    });
  }
}

