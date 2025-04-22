"use client"

import type React from "react"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Pie,
  Cell,
  Area,
  Tooltip,
} from "recharts"

export const Chart = ResponsiveContainer
export const ChartLegendItem = ({ name, color }: { name: string; color: string }) => (
  <div className="flex items-center">
    <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: color }}></div>
    <span>{name}</span>
  </div>
)

export const ChartPie = Pie
export const ChartCell = Cell
export const ChartGrid = CartesianGrid
export const ChartLine = Line
export const ChartXAxis = XAxis
export const ChartYAxis = YAxis
export const ChartArea = Area
export const ChartTooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-white border rounded-md shadow-md p-2">{children}</div>
}

export const ChartLegend = Legend
export const ChartContainer = ({
  children,
  data,
  xAxisKey,
  yAxisKey,
  margin,
  className,
}: {
  children: React.ReactNode
  data: any[]
  xAxisKey?: string
  yAxisKey?: string
  margin?: { top: number; right: number; bottom: number; left: number }
  className?: string
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={margin}>
          {children}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export { Tooltip as ChartTooltip }
