

"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { kpiData } from "@/lib/data";
import { useAssetData } from "@/lib/contexts/AssetContext";

type AssetStatus = "Healthy" | "Warning" | "Critical" | "Offline";

type AssetData = {
  subplant: string;
  asset_id: string;
  node_id: string;
  asset_status: AssetStatus;
  node_status: AssetStatus;
};

type SubplantSummary = {
  subplant: string;
  totalAssets: number;
  totalNodes: number;
  healthyAssets: number;
  warningAssets: number;
  criticalAssets: number;
  offlineAssets: number;
  healthyNodes: number;
  warningNodes: number;
  criticalNodes: number;
  offlineNodes: number;
};

const processFlow = {
  "Manufacturing": [
    { name: "Bravo Bay", area: "Fabrication" },
    { name: "Hotel Sector", area: "Molding" },
    { name: "Charlie Works", area: "Finishing" },
  ],
  "Assembly & QC": [
    { name: "Alpha Station", area: "Assembly" },
    { name: "Delta Point", area: "QC & Testing" },
  ],
  "Logistics & Shipping": [
    { name: "India Complex", area: "Packaging" },
    { name: "Foxtrot Factory", area: "Logistics" },
    { name: "Echo Yard", area: "Warehouse" },
    { name: "Gamma Plant", area: "Shipping" },
  ]
};

const statusIcons: Record<Exclude<AssetStatus, "Healthy">, { icon: React.ElementType, color: string }> = {
    Offline: { icon: WifiOff, color: "text-gray-500" },
    Warning: { icon: AlertTriangle, color: "text-yellow-500" },
    Critical: { icon: AlertTriangle, color: "text-red-500" },
};

type Asset = {
  id: string;
  name: string;
  status: AssetStatus;
  subplant: string;
  lastCheckin: string;
};

export default function HomePage() {
  const { assetData, loading, error } = useAssetData();

  const getSubplantSummary = (subplantName: string): SubplantSummary => {
    const subplantData = assetData.filter(item => item.subplant === subplantName);
    const uniqueAssets = [...new Set(subplantData.map(item => item.asset_id))];
    
    // Calculate asset status based on node statuses within each asset
    let healthyAssets = 0;
    let warningAssets = 0;
    let criticalAssets = 0;
    let offlineAssets = 0;

    uniqueAssets.forEach(assetId => {
      const assetNodes = subplantData.filter(item => item.asset_id === assetId);
      // Determine asset status based on its nodes - prioritize most critical status
      if (assetNodes.some(node => node.node_status === 'Critical')) {
        criticalAssets++;
      } else if (assetNodes.some(node => node.node_status === 'Warning')) {
        warningAssets++;
      } else if (assetNodes.some(node => node.node_status === 'Offline')) {
        offlineAssets++;
      } else {
        healthyAssets++;
      }
    });

    const nodeStatusCounts = subplantData.reduce((acc, item) => {
      acc[item.node_status] = (acc[item.node_status] || 0) + 1;
      return acc;
    }, {} as Record<AssetStatus, number>);

    return {
      subplant: subplantName,
      totalAssets: uniqueAssets.length,
      totalNodes: subplantData.length,
      healthyAssets,
      warningAssets,
      criticalAssets,
      offlineAssets,
      healthyNodes: nodeStatusCounts.Healthy || 0,
      warningNodes: nodeStatusCounts.Warning || 0,
      criticalNodes: nodeStatusCounts.Critical || 0,
      offlineNodes: nodeStatusCounts.Offline || 0,
    };
  };

  const getUniqueSubplants = () => {
    return [...new Set(assetData.map(item => item.subplant))];
  };

  const importantKPIs = kpiData.filter(kpi => kpi.title === "Alerts Triggered" || kpi.title === "% Uptime");

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          <div className="text-center">Loading asset data...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          <div className="text-center text-red-500">Error loading data: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
            {importantKPIs.map((kpi, index) => {
              const cardContent = (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">{kpi.title}</CardTitle>
                        <kpi.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="py-2">
                        <div className="text-3xl font-bold">{kpi.value}</div>
                        <p className="text-sm text-muted-foreground">{kpi.description}</p>
                    </CardContent>
                </Card>
              );

              if (kpi.title === 'Alerts Triggered') {
                return (
                  <Link key={index} href="/alerts" className="hover:bg-accent/50 block rounded-lg transition-colors">
                    {cardContent}
                  </Link>
                )
              }

              return <div key={index}>{cardContent}</div>;
            })}
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Assets by Subplant</CardTitle>
                <CardDescription>View assets across all subplants.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 lg:p-8 rounded-lg">
                <div className="flex flex-wrap gap-6 justify-center">
                  {getUniqueSubplants().map((subplant) => {
                    const summary = getSubplantSummary(subplant);
                    const criticalPercentage = summary.totalAssets > 0 ? (summary.criticalAssets / summary.totalAssets) * 100 : 0;
                    const isCriticalBlinking = criticalPercentage >= 50;
                    
                    return (
                      <Link 
                        key={subplant} 
                        href={`/devices?subplant=${subplant}`} 
                        className={`transition-colors rounded-lg flex flex-col items-center p-6 h-40 border min-w-[250px] max-w-[300px] ${
                          isCriticalBlinking 
                            ? 'animate-pulse-red hover:opacity-90' 
                            : 'bg-background hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <div className="text-center">
                          <h3 className={`font-semibold text-lg mb-2 ${isCriticalBlinking ? 'text-white' : ''}`}>
                            {subplant}
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-500"/>
                              <span className={isCriticalBlinking ? 'text-white' : ''}>{summary.healthyAssets}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4 text-yellow-500"/>
                              <span className={isCriticalBlinking ? 'text-white' : ''}>{summary.warningAssets}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4 text-red-500"/>
                              <span className={isCriticalBlinking ? 'text-white' : ''}>{summary.criticalAssets}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <WifiOff className="h-4 w-4 text-gray-500"/>
                              <span className={isCriticalBlinking ? 'text-white' : ''}>{summary.offlineAssets}</span>
                            </div>
                          </div>
                          <p className={`text-xs mt-2 ${isCriticalBlinking ? 'text-white/90' : 'text-muted-foreground'}`}>
                            {summary.totalAssets} Assets • {summary.totalNodes} Nodes
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </CardContent>
        </Card>

      </main>
    </div>
  );
}
