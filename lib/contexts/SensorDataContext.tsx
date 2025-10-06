'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SensorData = {
  ts: string;
  temp: number;
  humidity: number;
  pressure: number;
};

type SensorDataContextType = {
  sensorData: SensorData[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  refreshData: () => Promise<void>;
};

const SensorDataContext = createContext<SensorDataContextType | undefined>(undefined);

export function SensorDataProvider({ children }: { children: ReactNode }) {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchSensorData = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
        console.log('Parsed sensor data:', data);
        setSensorData(data);
        setLastUpdated(new Date().toISOString());
      } else {
        throw new Error(result.error || 'Failed to fetch sensor data');
      }
    } catch (err) {
      setError(`Failed to load sensor data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Sensor data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchSensorData();
  };

  useEffect(() => {
    // Initial fetch
    fetchSensorData();
    
    // Set up polling every 10 minutes (600,000 ms)
    const interval = setInterval(fetchSensorData, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <SensorDataContext.Provider value={{ 
      sensorData, 
      loading, 
      error, 
      lastUpdated, 
      refreshData 
    }}>
      {children}
    </SensorDataContext.Provider>
  );
}

export function useSensorData() {
  const context = useContext(SensorDataContext);
  if (context === undefined) {
    throw new Error('useSensorData must be used within a SensorDataProvider');
  }
  return context;
}
