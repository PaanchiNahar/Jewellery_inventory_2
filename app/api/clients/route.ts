import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all clients
export async function GET() {
  const clients = await prisma.client.findMany();
  return NextResponse.json(clients);
}

// POST new client
export async function POST(req: Request) {
  const data = await req.json();

  const newClient = await prisma.client.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
    },
  });

  return NextResponse.json(newClient);
}
