"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { fetchClientDetails } from "@/lib/api"

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.id as string
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClientDetails = async () => {
      try {
        const data = await fetchClientDetails(clientId)
        setClient(data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load client details:", error)
        setLoading(false)
      }
    }

    loadClientDetails()
  }, [clientId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading client details...</p>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg mb-4">Client not found</p>
        <Button asChild>
          <Link href="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-4" asChild>
          <Link href="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Client Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Name</dt>
                <dd className="text-lg font-medium">{client.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Phone</dt>
                <dd>{client.phone}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd>{client.email || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Client Since</dt>
                <dd>{client.createdAt}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Total Purchases</dt>
                <dd className="text-lg font-medium">{client.totalPurchases}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Total Spent</dt>
                <dd className="text-lg font-medium">₹{client.totalSpent.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Last Purchase</dt>
                <dd>{client.lastPurchase}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" asChild>
              <Link href={`/billing?client=${client.id}`}>New Sale</Link>
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export History
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>All transactions made by this client</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {client.purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No purchase history found for this client.
                  </TableCell>
                </TableRow>
              ) : (
                client.purchases.map((purchase: any) => (
                  <TableRow key={purchase.billId}>
                    <TableCell className="font-medium">{purchase.billId}</TableCell>
                    <TableCell>{purchase.date}</TableCell>
                    <TableCell>{purchase.items}</TableCell>
                    <TableCell>
                      {purchase.paymentMethod.charAt(0).toUpperCase() + purchase.paymentMethod.slice(1)}
                    </TableCell>
                    <TableCell className="text-right">₹{purchase.amount.toLocaleString()}</TableCell>
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
