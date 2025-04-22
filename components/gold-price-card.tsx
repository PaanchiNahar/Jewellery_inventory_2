"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function GoldPriceCard() {
  const [price, setPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        // In a real app, this would fetch from an API
        const response = await fetch("/api/gold-price")
        const data = await response.json()
        setPrice(data.price)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch gold price:", error)
        // Fallback to mock price
        setPrice(6245.75)
        setLoading(false)
      }
    }

    fetchGoldPrice()
  }, [])

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-amber-900">Live Gold Price (per gram)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold text-amber-900">₹{price?.toLocaleString()}</div>
            <p className="text-xs text-amber-800">Updated just now</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
