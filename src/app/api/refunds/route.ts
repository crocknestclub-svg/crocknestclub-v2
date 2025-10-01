import { NextRequest, NextResponse } from 'next/server';
import { refundPayment } from '@/src/actions/payment';
import { prisma } from '@/src/lib/prisma';
import error from 'next/error';

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId } = await req.json();
    if (!orderId || !paymentId) {
      return NextResponse.json({ ok: false, error: 'Missing orderId or paymentId' }, { status: 400 });
    }
    const result = await refundPayment(paymentId);
    await prisma.order.update({ where: { id: orderId }, data: { status: 'REFUND_REQUESTED' } });
    return NextResponse.json({ ok: true, refund: result });
  } catch {
    return NextResponse.json({ ok: false, error: (error as { status?: number }).status || 500 });
  }
}


