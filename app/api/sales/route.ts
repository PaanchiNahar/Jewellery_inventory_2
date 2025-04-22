import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const paymentMethod = searchParams.get('paymentMethod');
    const search = searchParams.get('search');

    // Build the where clause based on filters
    const where: Prisma.billWhereInput = {
      billitem: {
        some: {
          ornament: {
            isSold: true
          }
        }
      }
    };
    
    if (date) {
      where.createdAt = {
        gte: new Date(date),
        lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      };
    }

    // Payment method filter removed as it's not in the schema

    if (search) {
      where.OR = [
        { client: { name: { contains: search } } },
        { client: { phone: { contains: search } } }
      ];
    }

    // Fetch sales with related data
    const sales = await prisma.bill.findMany({
      where,
      include: {
        client: true,
        billitem: {
          include: {
            ornament: {
              include: {
                merchant: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match frontend expectations
    const transformedSales = sales.map(bill => ({
      id: bill.id,
      billId: `BILL-${bill.id.toString().padStart(6, '0')}`,
      clientName: bill.client.name,
      clientPhone: bill.client.phone,
      date: bill.createdAt,
      items: bill.billitem.length,
      total: bill.totalAmount,
      itemDetails: bill.billitem.map(item => ({
        ornamentId: item.ornament.ornamentId,
        type: item.ornament.type,
        merchantName: item.ornament.merchant.name,
        merchantCode: item.ornament.merchantCode,
        sellingPrice: item.sellingPrice
      }))
    }));

    return NextResponse.json(transformedSales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales history' },
      { status: 500 }
    );
  }
}