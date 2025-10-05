import type { Alert, Ticket } from "./types";
import { Activity, Bot, AlertTriangle, CheckCircle } from "lucide-react";

export const alerts: Alert[] = [
  {
    id: "ALERT-001",
    description: "Motor temperature exceeds 90°C",
    severity: "Critical",
    status: "New",
    timestamp: "2024-05-23T10:30:00Z",
    device: "Motor-A1",
  },
  {
    id: "ALERT-002",
    description: "Unusual vibration pattern detected",
    severity: "High",
    status: "New",
    timestamp: "2024-05-23T10:25:00Z",
    device: "Motor-B2",
  },
  {
    id: "ALERT-003",
    description: "Device offline for 15 minutes",
    severity: "High",
    status: "Acknowledged",
    timestamp: "2024-05-23T09:50:00Z",
    device: "Device-C3",
  },
  {
    id: "ALERT-004",
    description: "Fleet vehicle deviated from route",
    severity: "Medium",
    status: "New",
    timestamp: "2024-05-23T09:45:00Z",
    device: "Truck-05",
  },
  {
    id: "ALERT-005",
    description: "Low oil pressure warning",
    severity: "Medium",
    status: "Resolved",
    timestamp: "2024-05-22T18:00:00Z",
    device: "Motor-A1",
  },
    {
    id: "ALERT-006",
    description: "Firmware update failed",
    severity: "Low",
    status: "Resolved",
    timestamp: "2024-05-22T15:20:00Z",
    device: "Device-D4",
  },
];

export const tickets: Ticket[] = [
  {
    id: "TICK-2024-001",
    subject: "Investigate Motor-B2 vibrations",
    client: "Client Corp A",
    status: "Open",
    lastUpdated: "2024-05-23T10:28:00Z",
    priority: "High",
  },
  {
    id: "TICK-2024-002",
    subject: "Device-C3 offline",
    client: "Client Corp B",
    status: "In Progress",
    lastUpdated: "2024-05-23T10:05:00Z",
    priority: "High",
  },
  {
    id: "TICK-2024-003",
    subject: "Review route deviation for Truck-05",
    client: "Logistics Inc.",
    status: "Open",
    lastUpdated: "2024-05-23T09:48:00Z",
    priority: "Medium",
  },
  {
    id: "TICK-2024-004",
    subject: "Scheduled maintenance for Motor-A1",
    client: "Client Corp A",
    status: "Closed",
    lastUpdated: "2024-05-22T20:10:00Z",
    priority: "Medium",
  },
  {
    id: "TICK-2024-005",
    subject: "Failed firmware update on Device-D4",
    client: "Client Corp C",
    status: "Closed",
    lastUpdated: "2024-05-22T17:00:00Z",
    priority: "Low",
  },
];


export const kpiData = [
    {
        title: "Active Devices",
        value: "1,483",
        metric: "devices",
        icon: Activity ,
        description: "21% more than last week",
        hasChart: false,
    },
    {
        title: "Total Devices",
        value: "1,500",
        metric: "devices",
        icon: Bot,
        description: "Provisioned across all sites",
        hasChart: false,
    },
    {
        title: "% Uptime",
        value: "99.8%",
        metric: "SLA",
        icon: CheckCircle,
        description: "Last 24 hours",
        hasChart: false,
    },
    {
        title: "Alerts Triggered",
        value: "52",
        metric: "alerts",
        icon: AlertTriangle,
        description: "10 critical alerts",
        hasChart: false,
    },
];

