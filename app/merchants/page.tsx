"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserPlus, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { fetchMerchants, addMerchant } from "@/lib/api"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function MerchantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddMerchantDialog, setShowAddMerchantDialog] = useState(false)
  const [newMerchant, setNewMerchant] = useState({ name: "", merchantCode: "", phone: "" })
  const [merchants, setMerchants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadMerchants = async () => {
      try {
        const data = await fetchMerchants(searchTerm)
        setMerchants(data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load merchants:", error)
        setLoading(false)
      }
    }

    loadMerchants()
  }, [searchTerm])

  // Handle adding a new merchant
  const handleAddMerchant = async () => {
    try {
      if (!newMerchant.name || !newMerchant.merchantCode) {
        toast({
          title: "Missing information",
          description: "Name and merchant code are required",
          variant: "destructive",
        })
        return
      }

      const response = await addMerchant(newMerchant)

      if (response.success) {
        toast({
          title: "Merchant added",
          description: "The merchant has been added successfully",
        })

        // Add the new merchant to the list
        setMerchants([
          ...merchants,
          {
            id: response.merchantId,
            ...newMerchant,
            totalOrnaments: 0,
            totalValue: 0,
            createdAt: new Date().toISOString().split("T")[0],
          },
        ])

        // Reset form and close dialog
        setNewMerchant({ name: "", merchantCode: "", phone: "" })
        setShowAddMerchantDialog(false)
      } else {
        toast({
          title: "Error adding merchant",
          description: response.error || "An unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding merchant:", error)
      toast({
        title: "Error adding merchant",
        description: "There was a problem adding the merchant. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Merchants</h1>
        <Button onClick={() => setShowAddMerchantDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Merchant
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Merchants</CardTitle>
          <CardDescription>Find merchants by name or code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search merchants..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Merchant List</CardTitle>
          <CardDescription>{loading ? "Loading..." : `Showing ${merchants.length} merchants`}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Merchant Code</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Ornaments</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Loading merchants...
                  </TableCell>
                </TableRow>
              ) : merchants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    No merchants found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                merchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.name}</TableCell>
                    <TableCell>{merchant.merchantCode}</TableCell>
                    <TableCell>{merchant.phone}</TableCell>
                    <TableCell>{merchant.totalOrnaments}</TableCell>
                    <TableCell>₹{merchant.totalValue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/merchants/${merchant.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAddMerchantDialog} onOpenChange={setShowAddMerchantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Merchant</DialogTitle>
            <DialogDescription>Enter merchant details to add them to your system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="merchant-name">Name *</Label>
              <Input
                id="merchant-name"
                value={newMerchant.name}
                onChange={(e) => setNewMerchant({ ...newMerchant, name: e.target.value })}
                placeholder="Enter merchant name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="merchant-code">Merchant Code *</Label>
              <Input
                id="merchant-code"
                value={newMerchant.merchantCode}
                onChange={(e) => setNewMerchant({ ...newMerchant, merchantCode: e.target.value })}
                placeholder="Enter unique merchant code (e.g., MER001)"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="merchant-phone">Phone Number</Label>
              <Input
                id="merchant-phone"
                value={newMerchant.phone}
                onChange={(e) => setNewMerchant({ ...newMerchant, phone: e.target.value })}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMerchantDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMerchant}>Add Merchant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
