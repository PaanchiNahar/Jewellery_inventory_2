"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { fetchInventoryData } from "@/lib/api"

// Fallback data in case API fails
const fallbackData = [
  { name: "Rings", value: 85, color: "#f59e0b" },
  { name: "Necklaces", value: 65, color: "#0ea5e9" },
  { name: "Earrings", value: 45, color: "#10b981" },
  { name: "Bracelets", value: 30, color: "#8b5cf6" },
  { name: "Pendants", value: 20, color: "#ec4899" },
]

export function InventoryChart() {
  const [data, setData] = useState(fallbackData)

  useEffect(() => {
    const loadInventoryData = async () => {
      try {
        const inventoryData = await fetchInventoryData()
        if (inventoryData && inventoryData.length > 0) {
          setData(inventoryData)
        }
      } catch (error) {
        console.error("Failed to load inventory data:", error)
        // Keep using fallback data
      }
    }

    loadInventoryData()
  }, [])

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} items`} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }} />
            <span className="text-xs">
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
