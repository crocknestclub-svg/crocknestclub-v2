import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, productIds } = body as { userId?: string; productIds: string[] };
    if (!productIds || productIds.length === 0) {
      return NextResponse.json({ ok: false, error: 'No products' }, { status: 400 });
    }
    const order = await prisma.order.create({
      data: {
        userId,
        products: { connect: productIds.map((id) => ({ id })) },
        status: 'PENDING',
      },
    });
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}


