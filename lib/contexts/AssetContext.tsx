'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AssetData = {
  subplant: string;
  asset_id: string;
  node_id: string;
  asset_status: string;
  node_status: string;
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

  const fetchAssetData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/assets');
      if (!response.ok) {
        throw new Error('Failed to fetch asset data');
      }
      const data = await response.json();
      setAssetData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching asset data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchAssetData();
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
