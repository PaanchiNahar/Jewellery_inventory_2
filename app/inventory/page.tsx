"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Download, Filter, PlusCircle, Search } from "lucide-react"

// Mock inventory data
const inventoryData = [
  {
    id: "ORN001",
    name: "Gold Ring with Diamond",
    type: "ring",
    weight: 8.5,
    costPrice: 42500,
    merchant: "Rajesh Jewelers",
    status: "in_stock",
    addedDate: "2023-10-15",
  },
  {
    id: "ORN002",
    name: "Gold Necklace with Pendant",
    type: "necklace",
    weight: 15.2,
    costPrice: 76000,
    merchant: "Golden Creations",
    status: "in_stock",
    addedDate: "2023-11-02",
  },
  {
    id: "ORN003",
    name: "Gold Earrings",
    type: "earring",
    weight: 4.8,
    costPrice: 24000,
    merchant: "Sharma & Sons",
    status: "sold",
    addedDate: "2023-09-28",
  },
  {
    id: "ORN004",
    name: "Gold Bracelet",
    type: "bracelet",
    weight: 12.3,
    costPrice: 61500,
    merchant: "Royal Gold",
    status: "in_stock",
    addedDate: "2023-12-05",
  },
  {
    id: "ORN005",
    name: "Gold Pendant",
    type: "pendant",
    weight: 3.6,
    costPrice: 18000,
    merchant: "Rajesh Jewelers",
    status: "in_stock",
    addedDate: "2024-01-10",
  },
  {
    id: "ORN006",
    name: "Diamond Studded Ring",
    type: "ring",
    weight: 7.2,
    costPrice: 36000,
    merchant: "Golden Creations",
    status: "sold",
    addedDate: "2023-08-15",
  },
  {
    id: "ORN007",
    name: "Gold Chain",
    type: "necklace",
    weight: 18.5,
    costPrice: 92500,
    merchant: "Sharma & Sons",
    status: "in_stock",
    addedDate: "2023-12-20",
  },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [merchantFilter, setMerchantFilter] = useState("all")

  // Get unique merchants for filter
  const merchants = Array.from(new Set(inventoryData.map((item) => item.merchant)))

  // Filter inventory based on search and filters
  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesMerchant = merchantFilter === "all" || item.merchant === merchantFilter

    return matchesSearch && matchesType && matchesStatus && matchesMerchant
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <a href="/add-ornament">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Ornament
            </a>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <span>
                    {typeFilter === "all" ? "All Types" : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ring">Ring</SelectItem>
                  <SelectItem value="necklace">Necklace</SelectItem>
                  <SelectItem value="earring">Earring</SelectItem>
                  <SelectItem value="bracelet">Bracelet</SelectItem>
                  <SelectItem value="pendant">Pendant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <span>
                    {statusFilter === "all" ? "All Status" : statusFilter === "in_stock" ? "In Stock" : "Sold"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={merchantFilter} onValueChange={setMerchantFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <span>{merchantFilter === "all" ? "All Merchants" : merchantFilter}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Merchants</SelectItem>
                  {merchants.map((merchant) => (
                    <SelectItem key={merchant} value={merchant}>
                      {merchant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ornaments</CardTitle>
          <CardDescription>
            Showing {filteredInventory.length} of {inventoryData.length} items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Weight (g)</TableHead>
                <TableHead>Cost Price (₹)</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                    No items found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.weight}g</TableCell>
                    <TableCell>₹{item.costPrice.toLocaleString()}</TableCell>
                    <TableCell>{item.merchant}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === "in_stock" ? "default" : "secondary"}
                        className={
                          item.status === "in_stock" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {item.status === "in_stock" ? "In Stock" : "Sold"}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.addedDate}</TableCell>
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
