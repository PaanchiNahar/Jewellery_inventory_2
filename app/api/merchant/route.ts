import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const merchantCode = searchParams.get("merchantCode");

  try {
    if (merchantCode) {
      // Get specific merchant with ornament details and sales data
      const merchant = await prisma.merchant.findUnique({
        where: { merchantCode },
        include: {
          ornament: {
            orderBy: { createdAt: 'desc' },
            include: {
              billitem: {
                include: {
                  bill: true
                }
              }
            }
          },
        },
      });

      if (!merchant) {
        return NextResponse.json(
          { error: "Merchant not found" },
          { status: 404 }
        );
      }

      // Calculate merchant statistics
      const totalOrnaments = merchant.ornament.length;
      const inStock = merchant.ornament.filter(o => !o.isSold).length;
      const sold = merchant.ornament.filter(o => o.isSold).length;
      const totalValue = merchant.ornament.reduce((sum, o) => sum + o.costPrice, 0);

      // Format ornaments with status
      const ornaments = merchant.ornament.map(o => ({
        ...o,
        status: o.isSold ? "sold" : "in_stock"
      }));

      return NextResponse.json({
        ...merchant,
        totalOrnaments,
        inStock,
        sold,
        totalValue,
        ornaments
      });
    }

    // Get all merchants with summary stats
    const merchants = await prisma.merchant.findMany({
      include: {
        ornament: true,
      },
    });

    const merchantsWithStats = merchants.map(merchant => {
      const totalOrnaments = merchant.ornament.length;
      const inStock = merchant.ornament.filter(o => !o.isSold).length;
      const sold = merchant.ornament.filter(o => o.isSold).length;
      const totalValue = merchant.ornament.reduce((sum, o) => sum + o.costPrice, 0);

      return {
        ...merchant,
        totalOrnaments,
        inStock,
        sold,
        totalValue,
      };
    });

    return NextResponse.json(merchantsWithStats);
  } catch (error) {
    console.error("Error fetching merchants:", error);
    return NextResponse.json(
      { error: "Failed to fetch merchants" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { merchantCode, name, phone } = body;

    // Create merchant with initial stats
    const merchant = await prisma.merchant.create({
      data: {
        merchantCode,
        name,
        phone,
      },
      include: {
        ornament: true
      }
    });

    // Return merchant with calculated stats
    const merchantWithStats = {
      ...merchant,
      totalOrnaments: 0,
      inStock: 0,
      sold: 0,
      totalValue: 0
    };

    return NextResponse.json(merchantWithStats);
  } catch (error) {
    console.error("Error creating merchant:", error);
    return NextResponse.json(
      { error: "Failed to create merchant" },
      { status: 500 }
    );
  }
}