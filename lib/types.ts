export type Alert = {
  id: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "New" | "Acknowledged" | "Resolved";
  timestamp: string;
  device: string;
};

export type Ticket = {
  id: string;
  subject: string;
  client: string;
  status: "Open" | "In Progress" | "Closed";
  lastUpdated: string;
  priority: "High" | "Medium" | "Low";
};
