"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Download, Filter, Search } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { fetchSalesHistory } from "@/lib/api"

// Fallback data in case API fails
const fallbackSales = [
  {
    id: 1,
    billId: "BILL001",
    clientName: "Priya Sharma",
    clientPhone: "9876543210",
    date: "2023-04-15",
    items: 3,
    total: 42500,
    paymentMethod: "cash",
  },
  {
    id: 2,
    billId: "BILL002",
    clientName: "Rahul Patel",
    clientPhone: "8765432109",
    date: "2023-04-14",
    items: 1,
    total: 18950,
    paymentMethod: "card",
  },
  {
    id: 3,
    billId: "BILL003",
    clientName: "Ananya Singh",
    clientPhone: "7654321098",
    date: "2023-04-13",
    items: 4,
    total: 56200,
    paymentMethod: "upi",
  },
]

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [salesData, setSalesData] = useState(fallbackSales)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSalesData = async () => {
      try {
        const data = await fetchSalesHistory({
          date: date ? format(date, "yyyy-MM-dd") : undefined,
          paymentMethod: paymentFilter !== "all" ? paymentFilter : undefined,
          search: searchTerm || undefined,
        })

        if (data && data.length > 0) {
          setSalesData(data)
        }
        setLoading(false)
      } catch (error) {
        console.error("Failed to load sales data:", error)
        setLoading(false)
      }
    }

    loadSalesData()
  }, [date, paymentFilter, searchTerm])

  // Calculate total sales
  const totalSales = salesData.reduce((sum, sale) => sum + sale.total, 0)

  // Calculate total items sold
  const totalItems = salesData.reduce((sum, sale) => sum + sale.items, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Sales History</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bills Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.length}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search sales history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by client or bill ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <span>
                    {paymentFilter === "all"
                      ? "All Payment Methods"
                      : paymentFilter.charAt(0).toUpperCase() + paymentFilter.slice(1)}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Records</CardTitle>
          <CardDescription>{loading ? "Loading..." : `Showing ${salesData.length} records`}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Total (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Loading sales data...
                  </TableCell>
                </TableRow>
              ) : salesData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    No sales records found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                salesData.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.billId}</TableCell>
                    <TableCell>{format(new Date(sale.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div>{sale.clientName}</div>
                      <div className="text-sm text-muted-foreground">{sale.clientPhone}</div>
                    </TableCell>
                    <TableCell>
                      <div>{sale.items} items</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${sale.paymentMethod === "cash" ? "bg-green-100 text-green-800" : ""}
                          ${sale.paymentMethod === "card" ? "bg-blue-100 text-blue-800" : ""}
                          ${sale.paymentMethod === "upi" ? "bg-purple-100 text-purple-800" : ""}
                          ${sale.paymentMethod === "bank" ? "bg-orange-100 text-orange-800" : ""}`}
                      >
                        {sale.paymentMethod.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{sale.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
