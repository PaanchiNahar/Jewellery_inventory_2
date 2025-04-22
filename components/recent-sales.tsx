"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { fetchRecentSales } from "@/lib/api"

// Fallback data in case API fails
const fallbackSales = [
  {
    id: 1,
    client: "Priya Sharma",
    email: "priya@example.com",
    amount: "₹42,500",
    date: "2 hours ago",
    items: 3,
    initials: "PS",
  },
  {
    id: 2,
    client: "Rahul Patel",
    email: "rahul@example.com",
    amount: "₹18,950",
    date: "4 hours ago",
    items: 1,
    initials: "RP",
  },
  {
    id: 3,
    client: "Ananya Singh",
    email: "ananya@example.com",
    amount: "₹56,200",
    date: "Yesterday",
    items: 4,
    initials: "AS",
  },
  {
    id: 4,
    client: "Vikram Mehta",
    email: "vikram@example.com",
    amount: "₹32,800",
    date: "Yesterday",
    items: 2,
    initials: "VM",
  },
]

export function RecentSales() {
  const [sales, setSales] = useState(fallbackSales)

  useEffect(() => {
    const loadRecentSales = async () => {
      try {
        const recentSales = await fetchRecentSales()
        if (recentSales && recentSales.length > 0) {
          setSales(recentSales)
        }
      } catch (error) {
        console.error("Failed to load recent sales:", error)
        // Keep using fallback data
      }
    }

    loadRecentSales()
  }, [])

  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9 mr-3">
            <AvatarFallback className="bg-amber-100 text-amber-800">{sale.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.client}</p>
            <p className="text-xs text-muted-foreground">{sale.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{sale.amount}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{sale.items} items</span>
              <span>•</span>
              <span>{sale.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
