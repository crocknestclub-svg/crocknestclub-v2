import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { assertAdmin } from '@/src/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    await assertAdmin(req);
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ ok: false, error: 'Missing orderId' }, { status: 400 });
    const order = await prisma.order.update({ where: { id: orderId }, data: { status: 'RETURN_APPROVED' } });
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: (error as { status?: number }).status || 500 });
  }
}


