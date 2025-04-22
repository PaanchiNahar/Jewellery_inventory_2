import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrCode, type } = body;

    if (qrCode) {
      // Search by QR code
      const ornament = await prisma.ornament.findFirst({
        where: {
          ornamentId: qrCode, // Use ornamentId instead of qrCode
          isSold: false,
        },
      });
    } else if (type) {
      // Get items by type for dropdown
      const ornaments = await prisma.ornament.findMany({
        where: {
          type: type,
          isSold: false,
        },
        select: {
          ornamentId: true,
          type: true,
          weight: true,
          purity: true,
          costPrice: true,
          merchantCode: true,
        },
      });
      // Calculate selling price for each item
      const itemsWithPrice = ornaments.map(ornament => ({
        ...ornament,
        sellingPrice: Math.round(ornament.costPrice * 1.03)
      }));

      return NextResponse.json({ success: true, items: itemsWithPrice });
    }

    if (!ornament) {
      return NextResponse.json(
        { success: false, error: "Item not found or already sold" },
        { status: 404 }
      );
    }

      if (!ornament) {
        return NextResponse.json(
          { success: false, error: "Item not found or already sold" },
          { status: 404 }
        );
      }

      // Calculate selling price (cost price + 3% tax)
      const sellingPrice = Math.round(ornament.costPrice * 1.03);

      return NextResponse.json({
        success: true,
        item: {
          ...ornament,
          sellingPrice,
        },
      });
  } catch (error) {
    console.error("Error scanning item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to scan item" },
      { status: 500 }
    );
  }
}