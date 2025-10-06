
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { alerts as initialAlerts } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Alert } from "@/lib/types";

function SeverityBadge({ severity }: { severity: Alert["severity"] }) {
  return (
    <Badge
      variant={
        severity === "Critical" || severity === "High"
          ? "destructive"
          : "secondary"
      }
    >
      {severity}
    </Badge>
  );
}

function StatusBadge({ status }: { status: Alert["status"] }) {
  const statusConfig = {
    New: "bg-red-500",
    Acknowledged: "bg-yellow-500",
    Resolved: "bg-green-500",
  };
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", statusConfig[status])} />
      <span>{status}</span>
    </div>
  );
}

function TimestampCell({ timestamp }: { timestamp: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <TableCell>
      {isClient ? new Date(timestamp).toLocaleString() : ""}
    </TableCell>
  );
}


export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const router = useRouter();

  const handleStatusChange = (
    alertId: string,
    status: "New" | "Acknowledged" | "Resolved"
  ) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, status } : alert
      )
    );
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Alert Monitoring</CardTitle>
            <CardDescription>
              Real-time alerts and notifications for all monitored systems.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">
                      {alert.device}
                    </TableCell>
                    <TableCell>{alert.description}</TableCell>
                    <TableCell>
                      <SeverityBadge severity={alert.severity} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={alert.status} />
                    </TableCell>
                    <TimestampCell timestamp={alert.timestamp} />
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(alert.id, "Acknowledged")
                            }
                            disabled={alert.status === "Acknowledged" || alert.status === "Resolved"}
                          >
                            Acknowledge
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(alert.id, "Resolved")
                            }
                             disabled={alert.status === "Resolved"}
                          >
                            Resolve
                          </DropdownMenuItem>
                          {alert.status === "Resolved" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(alert.id, "New")
                              }
                            >
                              Re-open Alert
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={() => router.push('/analytics')}>
                              <BarChart className="mr-2 h-4 w-4" />
                              View Analytics
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => router.push('/scheduling')}>
                              Schedule Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
