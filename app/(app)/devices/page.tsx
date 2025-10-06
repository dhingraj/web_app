
"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Server, WifiOff, BarChart, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useAssetData } from "@/lib/contexts/AssetContext";

type AssetStatus = "Healthy" | "Warning" | "Critical" | "Offline";

type AssetData = {
  subplant: string;
  asset_id: string;
  node_id: string;
  asset_status: AssetStatus;
  node_status: AssetStatus;
};

type Asset = {
  id: string;
  name: string;
  status: AssetStatus;
  subplant: string;
  lastCheckin: string;
  reason: string;
  nodes: string[];
};


const statusConfig: Record<AssetStatus, { icon: React.ElementType, color: string, variant: "default" | "destructive" | "secondary" | "outline" }> = {
    Healthy: { icon: CheckCircle, color: 'text-green-500', variant: 'default' },
    Warning: { icon: AlertTriangle, color: 'text-yellow-500', variant: 'secondary' },
    Critical: { icon: AlertTriangle, color: 'text-red-500', variant: 'destructive' },
    Offline: { icon: WifiOff, color: 'text-gray-500', variant: 'outline' },
};


function AssetsPageContent() {
  const searchParams = useSearchParams();
  const initialSubplantFilter = searchParams.get('subplant') || 'all';
  const { assetData, loading, error } = useAssetData();

  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [subplants, setSubplants] = useState<string[]>([]);
  const [subplantFilter, setSubplantFilter] = useState<string>(initialSubplantFilter);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [openAccordionItem, setOpenAccordionItem] = useState<string | undefined>();

  useEffect(() => {
    if (assetData.length > 0) {
      // Extract unique subplants
      const uniqueSubplants = Array.from(new Set(assetData.map((item: AssetData) => item.subplant)));
      setSubplants(uniqueSubplants);
      
      // Transform data into Asset format
      const assetsMap = new Map<string, Asset>();
      
      assetData.forEach((item: AssetData) => {
        const assetKey = `${item.subplant}-${item.asset_id}`;
        
        if (!assetsMap.has(assetKey)) {
          assetsMap.set(assetKey, {
            id: item.asset_id,
            name: item.asset_id.replace('_', ' '),
            status: item.asset_status,
            subplant: item.subplant,
            lastCheckin: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
            reason: getReasonForStatus(item.asset_status),
            nodes: []
          });
        }
        
        const asset = assetsMap.get(assetKey)!;
        asset.nodes.push(item.node_id);
        
        // Update status to most critical if needed
        if (item.asset_status === 'Critical' || 
            (item.asset_status === 'Warning' && asset.status === 'Healthy') ||
            (item.asset_status === 'Offline' && asset.status === 'Healthy')) {
          asset.status = item.asset_status;
          asset.reason = getReasonForStatus(item.asset_status);
        }
      });
      
      setAllAssets(Array.from(assetsMap.values()));
    }
  }, [assetData]);

  const getReasonForStatus = (status: AssetStatus): string => {
    switch (status) {
      case 'Offline': return 'No connection detected. Last check-in over 24 hours ago.';
      case 'Critical': return 'Critical alert triggered. Immediate attention required.';
      case 'Warning': return 'Operating outside of normal parameters.';
      case 'Healthy': return 'Asset is operating normally.';
      default: return 'Status details not available.';
    }
  };

  const filteredAssets = useMemo(() => {
    let assets = allAssets;

    if (subplantFilter !== "all") {
      assets = assets.filter(asset => asset.subplant === subplantFilter);
    }

    if (searchFilter) {
      assets = assets.filter(asset => 
        asset.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    return assets;
  }, [subplantFilter, searchFilter, allAssets]);

  const assetsBySubplant = useMemo(() => {
    return filteredAssets.reduce((acc, asset) => {
      if (!acc[asset.subplant]) {
        acc[asset.subplant] = [];
      }
      acc[asset.subplant].push(asset);
      return acc;
    }, {} as Record<string, typeof allAssets>);
  }, [filteredAssets]);

  useEffect(() => {
    if (subplantFilter !== "all") {
      setOpenAccordionItem(subplantFilter);
    } else {
      const firstSubplant = Object.keys(assetsBySubplant)[0];
      setOpenAccordionItem(searchFilter ? firstSubplant : undefined);
    }
  }, [subplantFilter, assetsBySubplant, searchFilter]);
  
  useEffect(() => {
    const subplantFromUrl = searchParams.get('subplant');
    if (subplantFromUrl && subplants.includes(subplantFromUrl)) {
      setSubplantFilter(subplantFromUrl);
    }
  }, [searchParams]);

  const handleSubplantFilterChange = (value: string) => {
    setSubplantFilter(value);
  };
  
  const getStatusDetails = (asset: Asset) => {
    switch (asset.status) {
        case 'Offline': return asset.reason;
        case 'Critical': return 'Critical alert triggered. Immediate attention required.';
        case 'Warning': return 'Operating outside of normal parameters.';
        case 'Healthy': return 'Asset is operating normally.';
        default: return 'Status details not available.';
    }
  }

  const statusOrder: AssetStatus[] = ["Critical", "Warning", "Offline", "Healthy"];

  const sortAssetsByHealth = (assets: Asset[]) => {
    return assets.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
  };


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
        <Card>
          <CardHeader>
            <CardTitle>Asset Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={subplantFilter} onValueChange={handleSubplantFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Sub-plant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub-plants</SelectItem>
                  {subplants.map(plant => (
                    <SelectItem key={plant} value={plant}>{plant}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
                <Input 
                  placeholder="Search by Asset ID or Name..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Asset Inventory</CardTitle>
                <CardDescription>A searchable, filterable inventory with quick health cues.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full" value={openAccordionItem} onValueChange={setOpenAccordionItem}>
                    {Object.entries(assetsBySubplant).map(([subplant, assets]) => (
                        <AccordionItem value={subplant} key={subplant}>
                            <AccordionTrigger className="text-lg font-semibold font-headline hover:no-underline">
                              <div className="flex items-center gap-4">
                                <Server className="h-6 w-6" />
                                <span>{subplant} ({assets.length} assets)</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                                {sortAssetsByHealth(assets).map(asset => {
                                    const StatusIcon = statusConfig[asset.status].icon;
                                    return (
                                        <Collapsible key={asset.id} className="bg-muted/50 rounded-lg">
                                            <div className="p-4 flex items-center justify-between">
                                                <CollapsibleTrigger asChild>
                                                    <button className="flex-1 text-left">
                                                        <p className="font-semibold">{asset.name}</p>
                                                        <p className="text-sm text-muted-foreground">{asset.id}</p>
                                                    </button>
                                                </CollapsibleTrigger>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <CollapsibleTrigger asChild>
                                                        <Badge variant={statusConfig[asset.status].variant} className="flex items-center gap-2 cursor-pointer">
                                                            <StatusIcon className={cn("h-4 w-4", statusConfig[asset.status].color)} />
                                                            {asset.status}
                                                        </Badge>
                                                    </CollapsibleTrigger>
                                                </div>
                                            </div>
                                            <CollapsibleContent>
                                                <div className="px-4 pb-4 space-y-2">
                                                    <div className="p-3 bg-background rounded-md">
                                                        <p className="font-semibold text-sm">Status Details</p>
                                                        <p className="text-sm text-muted-foreground">{getStatusDetails(asset)}</p>
                                                        <p className="text-xs text-muted-foreground/80 mt-2">Last check-in: {new Date(asset.lastCheckin).toLocaleString()}</p>
                                                    </div>
                                                    <Link href={`/analytics?assetId=${asset.id}&subplant=${asset.subplant}`}>
                                                      <Button variant="outline" className="w-full">
                                                        <BarChart className="mr-2 h-4 w-4" />
                                                        View Analytics
                                                      </Button>
                                                    </Link>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    )
                                })}
                              </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                {filteredAssets.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        No assets found matching your criteria.
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function AssetsPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <AssetsPageContent />
    </React.Suspense>
  )
}
    
