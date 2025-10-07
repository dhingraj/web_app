import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // Disable caching

export async function GET(request: NextRequest) {
  try {
    console.log('Testing connection to AWS Lambda...');
    
    const response = await fetch('https://9r7r71emo7.execute-api.us-east-1.amazonaws.com/dev', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
    console.log('Successfully fetched data:', data);

    return NextResponse.json({
      success: true,
      data: data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    });

  } catch (error) {
    console.error('Connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof TypeError ? 'Network/TypeError' : 'Other'
    });
  }
}
