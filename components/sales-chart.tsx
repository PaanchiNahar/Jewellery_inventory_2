"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { fetchSalesData } from "@/lib/api"

// Fallback data in case API fails
const fallbackData = [
  { month: "Jan", sales: 125000 },
  { month: "Feb", sales: 165000 },
  { month: "Mar", sales: 145000 },
  { month: "Apr", sales: 185000 },
  { month: "May", sales: 205000 },
  { month: "Jun", sales: 175000 },
  { month: "Jul", sales: 195000 },
  { month: "Aug", sales: 235000 },
  { month: "Sep", sales: 225000 },
  { month: "Oct", sales: 255000 },
  { month: "Nov", sales: 275000 },
  { month: "Dec", sales: 325000 },
]

export function SalesChart() {
  const [data, setData] = useState(fallbackData)

  useEffect(() => {
    const loadSalesData = async () => {
      try {
        const salesData = await fetchSalesData()
        if (salesData && salesData.length > 0) {
          setData(salesData)
        }
      } catch (error) {
        console.error("Failed to load sales data:", error)
        // Keep using fallback data
      }
    }

    loadSalesData()
  }, [])

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
          <Area type="monotone" dataKey="sales" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
