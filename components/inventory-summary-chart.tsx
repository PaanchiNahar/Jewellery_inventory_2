"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Ring",
    inStock: 45,
    sold: 32,
  },
  {
    name: "Necklace",
    inStock: 28,
    sold: 24,
  },
  {
    name: "Earrings",
    inStock: 36,
    sold: 30,
  },
  {
    name: "Bracelet",
    inStock: 22,
    sold: 18,
  },
  {
    name: "Chain",
    inStock: 30,
    sold: 26,
  },
  {
    name: "Pendant",
    inStock: 18,
    sold: 12,
  },
]

export function InventorySummaryChart() {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="inStock" name="In Stock" fill="#8884d8" />
          <Bar dataKey="sold" name="Sold" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
