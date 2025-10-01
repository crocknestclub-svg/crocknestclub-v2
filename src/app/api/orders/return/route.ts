import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import error from 'next/error';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ ok: false, error: 'Missing orderId' }, { status: 400 });

    // Create a return request record (assumes a ReturnRequest model or use order notes)
    await prisma.order.update({ where: { id: orderId }, data: { status: 'RETURN_REQUESTED' } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: (error as { status?: number }).status || 500 });
  }
}


