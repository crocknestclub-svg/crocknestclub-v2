import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// Simple COD fallback to complete order without online payment
export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ ok: false, error: 'Missing orderId' }, { status: 400 });
    const order = await prisma.order.update({ where: { id: orderId }, data: { status: 'COD_PENDING' } });
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}


