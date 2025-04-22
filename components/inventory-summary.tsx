"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
  ChartPie,
  ChartCell,
} from "@/components/ui/chart"

const data = [
  { name: "Rings", value: 85, color: "#f59e0b" },
  { name: "Necklaces", value: 65, color: "#0ea5e9" },
  { name: "Earrings", value: 45, color: "#10b981" },
  { name: "Bracelets", value: 30, color: "#8b5cf6" },
  { name: "Pendants", value: 20, color: "#ec4899" },
]

export function InventorySummary() {
  return (
    <ChartContainer className="h-[300px]" data={data}>
      <ChartLegend className="mb-4 flex flex-wrap justify-center gap-4" iconSize={12} iconType="circle">
        {data.map((entry) => (
          <ChartLegendItem key={entry.name} name={`${entry.name} (${entry.value})`} color={entry.color} />
        ))}
      </ChartLegend>
      <ChartPie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        labelLine={false}
      >
        {data.map((entry, index) => (
          <ChartCell key={`cell-${index}`} fill={entry.color} />
        ))}
      </ChartPie>
      <ChartTooltip content={<CustomTooltip />} />
    </ChartContainer>
  )
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <ChartTooltipContent>
        <div className="font-medium">{payload[0].name}</div>
        <div style={{ color: payload[0].payload.color }}>Count: {payload[0].value}</div>
      </ChartTooltipContent>
    )
  }

  return null
}
