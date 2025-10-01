import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin } from '@/src/lib/adminAuth';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    await assertAdmin(req);
    const { orderId, provider, trackingNumber } = await req.json();
    if (!orderId || !provider || !trackingNumber) return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    const order = await prisma.order.update({ where: { id: orderId }, data: { status: 'SHIPPED' } });
    return NextResponse.json({ ok: true, shipment: { orderId, provider, trackingNumber }, order });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: (error as unknown as { status: number }).status || 500 });
  }
}


