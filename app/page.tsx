import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gem, QrCode, ShoppingBag, Users } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto py-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Gold Jewelry Stock Management System</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Complete solution for managing your jewelry inventory, sales, and client relationships
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/add-ornament">Add New Ornament</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader>
            <Gem className="h-8 w-8 text-amber-600 mb-2" />
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>Track all your ornaments with QR codes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add, edit, and manage your entire jewelry inventory with detailed tracking and QR code generation.
            </p>
            <Button asChild variant="ghost" className="mt-4 w-full">
              <Link href="/stock">View Stock</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <ShoppingBag className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>Sales Processing</CardTitle>
            <CardDescription>Create bills and process sales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Scan QR codes, add items to cart, and generate professional invoices for your customers.
            </p>
            <Button asChild variant="ghost" className="mt-4 w-full">
              <Link href="/billing">New Sale</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <Users className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle>Client Management</CardTitle>
            <CardDescription>Track client purchase history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Maintain detailed records of all your clients and their complete purchase history.
            </p>
            <Button asChild variant="ghost" className="mt-4 w-full">
              <Link href="/clients">View Clients</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <QrCode className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle>QR Scanning</CardTitle>
            <CardDescription>Scan ornaments for quick billing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use your device camera to scan QR codes for quick and error-free sales processing.
            </p>
            <Button asChild variant="ghost" className="mt-4 w-full">
              <Link href="/billing">Start Scanning</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Features</CardTitle>
          <CardDescription>Everything you need to manage your jewelry business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Ornament Entry",
                description: "Add new ornaments with detailed information and generate QR codes",
              },
              {
                title: "Stock Management",
                description: "Filter and search your inventory by type, merchant, and purity",
              },
              {
                title: "Billing System",
                description: "Create professional invoices with tax calculations and discounts",
              },
              {
                title: "Sales Analytics",
                description: "Track your sales performance with detailed reports and charts",
              },
              {
                title: "Client History",
                description: "View complete purchase history for each client",
              },
              {
                title: "Merchant Tracking",
                description: "Monitor ornaments provided by each merchant and their sales",
              },
            ].map((feature, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
