'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FrequencyData = {
  node_id: string;
  ts: string;
  sample_index: number;
  amp: number;
  vx: number;
  vy: number;
  vz: number;
};

type FrequencyDataContextType = {
  frequencyData: FrequencyData[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  refreshData: () => Promise<void>;
};

const FrequencyDataContext = createContext<FrequencyDataContextType | undefined>(undefined);

export function FrequencyDataProvider({ children }: { children: ReactNode }) {
  const [frequencyData, setFrequencyData] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchFrequencyData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add more aggressive cache-busting for manual refresh
      const timestamp = Date.now();
      const random = Math.random();
      const url = forceRefresh 
        ? `/api/frequency-spectrum?t=${timestamp}&r=${random}&refresh=${timestamp}&force=1`
        : `/api/frequency-spectrum?t=${timestamp}&r=${random}`;
      
      console.log('Fetching frequency spectrum data:', { url, forceRefresh, timestamp });
      
      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API response structure:', { 
        hasSuccess: 'success' in result, 
        hasData: 'data' in result,
        dataKeys: result.data ? Object.keys(result.data) : []
      });
      
      if (result.success && result.data) {
        // The response format is: { success: true, data: { statusCode: 200, body: "[...]" } }
        const apiResponse = result.data;
        
        if (apiResponse.statusCode !== 200) {
          throw new Error(`API returned status ${apiResponse.statusCode}`);
        }
        
        let data = apiResponse.body;
        
        // Parse if it's a string
        if (typeof data === 'string') {
          console.log('Parsing string body...');
          data = JSON.parse(data);
        }
        
        console.log('Parsed frequency data:', Array.isArray(data) ? data.length : 'not array', 'samples');
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
          console.error('Data is not array:', typeof data, data);
          throw new Error('Frequency data is not in expected array format');
        }
        
        // Values are already numbers in the new API format, but ensure they're numbers
        const parsedData = data.map((item: any) => ({
          node_id: item.node_id,
          ts: item.ts,
          sample_index: typeof item.sample_index === 'number' ? item.sample_index : parseInt(item.sample_index),
          amp: typeof item.amp === 'number' ? item.amp : parseFloat(item.amp),
          vx: typeof item.vx === 'number' ? item.vx : parseFloat(item.vx),
          vy: typeof item.vy === 'number' ? item.vy : parseFloat(item.vy),
          vz: typeof item.vz === 'number' ? item.vz : parseFloat(item.vz)
        }));
        
        console.log('Successfully parsed', parsedData.length, 'frequency samples');
        setFrequencyData(parsedData);
        setLastUpdated(new Date().toISOString());
      } else {
        throw new Error(result.error || 'Failed to fetch frequency data');
      }
    } catch (err) {
      setError(`Failed to load frequency data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Frequency data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    console.log('Manual refresh triggered for frequency data');
    await fetchFrequencyData(true); // Force refresh with aggressive cache-busting
  };

  useEffect(() => {
    // Initial fetch
    fetchFrequencyData();
    
    // Set up polling every 10 minutes (600,000 ms)
    const interval = setInterval(fetchFrequencyData, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <FrequencyDataContext.Provider value={{ 
      frequencyData, 
      loading, 
      error, 
      lastUpdated, 
      refreshData 
    }}>
      {children}
    </FrequencyDataContext.Provider>
  );
}

export function useFrequencyData() {
  const context = useContext(FrequencyDataContext);
  if (context === undefined) {
    throw new Error('useFrequencyData must be used within a FrequencyDataProvider');
  }
  return context;
}

