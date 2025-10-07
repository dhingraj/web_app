'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AssetStatus = "Healthy" | "Warning" | "Critical" | "Offline";

export type AssetData = {
  subplant: string;
  asset_id: string;
  node_id: string;
  asset_status: AssetStatus;
  node_status: AssetStatus;
};

type AssetContextType = {
  assetData: AssetData[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
};

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assetData, setAssetData] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssetData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add more aggressive cache-busting for manual refresh
      const timestamp = Date.now();
      const random = Math.random();
      const url = forceRefresh 
        ? `/api/assets?t=${timestamp}&r=${random}&refresh=${timestamp}&force=1`
        : `/api/assets?t=${timestamp}&r=${random}`;
      
      console.log('Fetching asset data:', { url, forceRefresh, timestamp });
      
      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch asset data');
      }
      const data = await response.json();
      console.log('Asset data received:', { count: data.length, forceRefresh });
      setAssetData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching asset data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    console.log('Manual refresh triggered');
    await fetchAssetData(true); // Force refresh with aggressive cache-busting
  };

  useEffect(() => {
    fetchAssetData();
  }, []);

  return (
    <AssetContext.Provider value={{ assetData, loading, error, refreshData }}>
      {children}
    </AssetContext.Provider>
  );
}

export function useAssetData() {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssetData must be used within an AssetProvider');
  }
  return context;
}
