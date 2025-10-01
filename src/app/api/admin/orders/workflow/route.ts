import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { assertAdmin } from '@/src/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    await assertAdmin(req);
    const { orderId, action } = await req.json();
    if (!orderId || !action) return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    let status: string | null = null;
    if (action === 'pack') status = 'PACKED';
    if (action === 'ship') status = 'SHIPPED';
    if (action === 'deliver') status = 'DELIVERED';
    if (!status) return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 });
    const order = await prisma.order.update({ where: { id: orderId }, data: { status } });
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: (error as unknown as { status: number }).status || 500 });
  }
}


