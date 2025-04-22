"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CircleDollarSign, Gem, Home, Package, QrCode, ShoppingBag, Users, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    label: "Add Ornament",
    icon: Gem,
    href: "/add-ornament",
  },
  {
    label: "Stock",
    icon: Package,
    href: "/stock",
  },
  {
    label: "Billing",
    icon: QrCode,
    href: "/billing",
  },
  {
    label: "Sales",
    icon: ShoppingBag,
    href: "/sales",
  },
  {
    label: "Clients",
    icon: Users,
    href: "/clients",
  },
  {
    label: "Merchants",
    icon: UserCircle,
    href: "/merchants",
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full w-64 bg-background border-r">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <CircleDollarSign className="h-8 w-8 text-amber-500" />
          <h1 className="text-xl font-bold">Gold Jewelry</h1>
        </div>
        <nav className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === route.href && "bg-amber-100 hover:bg-amber-200 text-amber-900",
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
