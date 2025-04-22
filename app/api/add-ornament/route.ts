import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  console.log("🔔 API HIT: /api/add-ornament");
  try {
    const body = await request.json();
    console.log("Request body:", body);
    const { type, weight, costPrice, merchantCode, purity } = body;

    const existingCount = await prisma.ornament.count({
      where: {
        type: type,
      },
    });

    // Step 2: Create the new ornament ID
    const prefix = type.toUpperCase().slice(0, 1); // RING, NECK, etc.
    const paddedNumber = String(existingCount + 1).padStart(3, "0"); // 001, 002...
    const ornamentId = `${prefix}${paddedNumber}`;

    const qrCode = JSON.stringify({
      ornamentId,
      type,
      weight,
      costPrice,
      merchantCode,
      purity,
    });

    const newOrnament = await prisma.ornament.create({
      data: {
        ornamentId,
        type,
        merchantCode,
        weight,
        costPrice,
        purity,
        qrCode, // Save the QR code as a string
        isSold: false, // default value
      },
    });
    return NextResponse.json({
      success: true,
      ornamentId,
    });
  } catch (error) {
    console.error("❌ Backend Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add ornament" },
      { status: 500 }
    );
  }
}
