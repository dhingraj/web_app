import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { AssetProvider } from "@/lib/contexts/AssetContext";
import { SensorDataProvider } from "@/lib/contexts/SensorDataContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "HalconX Analytics",
  description: "HalconX Analytics: Quicksight Dashboards, Alerting, and Ticket Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AssetProvider>
          <SensorDataProvider>
            {children}
          </SensorDataProvider>
        </AssetProvider>
        <Toaster />
      </body>
    </html>
  );
}
