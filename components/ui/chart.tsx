"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Chart context
const ChartContext = React.createContext<{
  config: Record<string, any>
}>({
  config: {},
})

const useChart = () => {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartProvider")
  }
  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: Record<string, any>
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs", 
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} />
        {children}
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id }: { id: string }) => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart="${id}"] {
  --color-background: 255 255 255;
  --color-foreground: 0 0 0;
  --color-chart-1: 12 74 110;
  --color-chart-2: 16 185 129;
  --color-chart-3: 245 158 11;
  --color-chart-4: 239 68 68;
  --color-chart-5: 139 92 246;
}

.dark [data-chart="${id}"] {
  --color-background: 0 0 0;
  --color-foreground: 255 255 255;
  --color-chart-1: 30 64 175;
  --color-chart-2: 34 197 94;
  --color-chart-3: 251 191 36;
  --color-chart-4: 248 113 113;
  --color-chart-5: 168 85 247;
}
        `,
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean
    payload?: any[]
    label?: string
  }
>(({ active, payload, label, className, ...props }, ref) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-md",
        className
      )}
      {...props}
    >
      {label && <div className="mb-1.5 font-medium">{label}</div>}
      <div className="grid gap-1.5">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-[2px]"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex flex-1 justify-between gap-2">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm font-medium tabular-nums">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: any[]
  }
>(({ payload, className, ...props }, ref) => {
  if (!payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn("flex flex-wrap justify-center gap-4", className)}
      {...props}
    >
      {payload.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-[2px]"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm">{item.value}</span>
        </div>
      ))}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  useChart,
}