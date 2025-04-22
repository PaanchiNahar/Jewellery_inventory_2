"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Download, Filter, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { fetchStock } from "@/lib/api";

// Fallback data in case API fails
const fallbackData = [
  {
    id: 1,
    ornamentId: "R001",
    name: "Gold Ring with Diamond",
    type: "ring",
    weight: 8.5,
    costPrice: 42500,
    merchant: "MER001",
    merchantName: "Rajesh Jewelers",
    status: "in_stock",
    purity: "22K",
    addedDate: "2023-10-15",
  },
  {
    id: 2,
    ornamentId: "N001",
    name: "Gold Necklace with Pendant",
    type: "necklace",
    weight: 15.2,
    costPrice: 76000,
    merchant: "MER002",
    merchantName: "Golden Creations",
    status: "in_stock",
    purity: "24K",
    addedDate: "2023-11-02",
  },
  {
    id: 3,
    ornamentId: "E001",
    name: "Gold Earrings",
    type: "earring",
    weight: 4.8,
    costPrice: 24000,
    merchant: "MER003",
    merchantName: "Sharma & Sons",
    status: "sold",
    purity: "18K",
    addedDate: "2023-09-28",
  },
];

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [merchantFilter, setMerchantFilter] = useState("all");
  const [purityFilter, setPurityFilter] = useState("all");
  const [stockData, setStockData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStockData = async () => {
      try {
        const data = await fetchStock({
          type: typeFilter !== "all" ? typeFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          merchant: merchantFilter !== "all" ? merchantFilter : undefined,
          purity: purityFilter !== "all" ? purityFilter : undefined,
          search: searchTerm || undefined,
        });

        if (data && data.length > 0) {
          setStockData(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to load stock data:", error);
        setLoading(false);
      }
    };

    loadStockData();
  }, [typeFilter, statusFilter, merchantFilter, purityFilter, searchTerm]);

  // Get unique merchants for filter
  const merchants = Array.from(
    new Set(stockData.map((item) => item.merchantName))
  );

  // Filter inventory based on search and filters
  const filteredInventory = stockData;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Stock</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/add-ornament">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Ornament
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by ID or merchant code..."
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
                    {typeFilter === "all"
                      ? "All Types"
                      : typeFilter.charAt(0).toUpperCase() +
                        typeFilter.slice(1)}
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
                    {statusFilter === "all"
                      ? "All Status"
                      : statusFilter === "in_stock"
                      ? "In Stock"
                      : "Sold"}
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
                  <span>
                    {merchantFilter === "all"
                      ? "All Merchants"
                      : merchantFilter}
                  </span>
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

            <div>
              <Select value={purityFilter} onValueChange={setPurityFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <span>
                    {purityFilter === "all" ? "All Purity" : purityFilter}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purity</SelectItem>
                  <SelectItem value="18K">18K</SelectItem>
                  <SelectItem value="22K">22K</SelectItem>
                  <SelectItem value="24K">24K</SelectItem>
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
            {loading
              ? "Loading..."
              : `Showing ${filteredInventory.length} items`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Weight (g)</TableHead>
                <TableHead>Cost Price (₹)</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Purity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    Loading stock data...
                  </TableCell>
                </TableRow>
              ) : filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-6"
                  >
                    No items found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.ornamentId}
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.weight}g</TableCell>
                    <TableCell>₹{item.costPrice.toLocaleString()}</TableCell>
                    <TableCell>{item.merchantName}</TableCell>
                    <TableCell>{item.purity}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "in_stock" ? "default" : "secondary"
                        }
                        className={
                          item.status === "in_stock"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
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
  );
}
