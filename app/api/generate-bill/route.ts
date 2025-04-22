import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nullable } from "zod";

type BillItem = {
  ornamentId: string;
  sellingPrice: number;
};

type BillData = {
  clientName: string;
  clientPhone: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json() as BillData;
    
    // Validate required fields and data types
    if (!body.clientName || !body.clientPhone || !body.items || body.items.length === 0 ||
        typeof body.subtotal !== 'number' || typeof body.tax !== 'number' || 
        typeof body.total !== 'number' || !body.paymentMethod) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    // Validate numeric values
    if (body.subtotal < 0 || body.tax < 0 || body.total < 0) {
      return NextResponse.json(
        { success: false, error: "Numeric values cannot be negative" },
        { status: 400 }
      );
    }
    const { clientName, clientPhone, items, subtotal, tax, total, paymentMethod } = body;

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Validate all ornaments exist and are not sold
      for (const item of items) {
        const ornament = await tx.ornament.findUnique({
          where: { ornamentId: item.ornamentId }
        });
        if (!ornament) {
          throw new Error(`Ornament ${item.ornamentId} not found`);
        }
        if (ornament.isSold) {
          throw new Error(`Ornament ${item.ornamentId} is already sold`);
        }
      }

      // Create or find client
      let client = await tx.client.findFirst({
        where: { phone: clientPhone },
      });

      if (!client) {
        client = await tx.client.create({
          data: {
            name: clientName,
            phone: clientPhone,
            email: null, // Make email nullable as per schema
          },
        });
      }

      // Create bill
      const bill = await tx.bill.create({
        data: {
          clientId: client.id,
          totalAmount: total,
          subtotal,
          tax,
          paymentMethod,
          BillItem: {
            create: items.map((item) => ({
              ornamentId: item.ornamentId,
              sellingPrice: item.sellingPrice,
            })),
          },
        },
        include: {
          BillItem: true,
        },
      });

      // Mark items as sold
      for (const item of items) {
        await tx.ornament.update({
          where: { ornamentId: item.ornamentId },
          data: { 
            isSold: true,
            soldAt: new Date(),
            soldPrice: item.sellingPrice
          },
          include: {
            merchant: true
          }
        });
      }

      return { 
        billId: bill.id,
        billNumber: `BILL-${bill.id.toString().padStart(6, '0')}`,
        date: new Date()
      };
    });

    return NextResponse.json({
      success: true,
      billId: result.billId,
    });
  } catch (error) {
    console.error("Error generating bill:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate bill" },
      { status: 500 }
    );
  }
}