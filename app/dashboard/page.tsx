"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, QrCode } from "lucide-react"
import Link from "next/link"
import { SalesChart } from "@/components/sales-chart"
import { InventoryChart } from "@/components/inventory-chart"
import { RecentSales } from "@/components/recent-sales"
import { GoldPriceCard } from "@/components/gold-price-card"
import { fetchDashboardData } from "@/lib/api"

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    itemsInStock: 0,
    totalSales: 0,
    loading: true,
  })

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData()
        setDashboardData({
          totalRevenue: data.totalRevenue,
          itemsInStock: data.itemsInStock,
          totalSales: data.totalSales,
          loading: false,
        })
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
        setDashboardData((prev) => ({ ...prev, loading: false }))
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/add-ornament">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Ornament
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/billing">
              <QrCode className="mr-2 h-4 w-4" />
              New Sale
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.loading ? "Loading..." : `₹${dashboardData.totalRevenue.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Items in Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.loading ? "Loading..." : dashboardData.itemsInStock}
            </div>
            <p className="text-xs text-muted-foreground">+12 new items this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.loading ? "Loading..." : dashboardData.totalSales}</div>
            <p className="text-xs text-muted-foreground">+7 from yesterday</p>
          </CardContent>
        </Card>
        <GoldPriceCard />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>View your sales performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Your most recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
            <CardDescription>Distribution of your current inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Merchants</CardTitle>
            <CardDescription>Your best performing suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Rajesh Jewelers", items: 45, value: "₹450,000" },
                { name: "Golden Creations", items: 32, value: "₹320,000" },
                { name: "Sharma & Sons", items: 28, value: "₹280,000" },
                { name: "Royal Gold", items: 24, value: "₹240,000" },
              ].map((merchant) => (
                <div key={merchant.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{merchant.name}</p>
                    <p className="text-sm text-muted-foreground">{merchant.items} items</p>
                  </div>
                  <div className="font-medium">{merchant.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
