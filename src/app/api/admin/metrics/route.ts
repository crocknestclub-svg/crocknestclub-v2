import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { assertAdmin } from '@/src/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    await assertAdmin(req);
    const [ordersCount, revenueAgg, lowStock] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        where: { status: { in: ['PAID'] } },
        include: { products: true },
        orderBy: { createdAt: 'desc' },
        take: 100, // sample recent for quick calc
      }),
      prisma.productVariant.findMany({ where: { inventory: { lt: 5 } }, take: 10 }),
    ]);
    const recentRevenue = revenueAgg.reduce((sum: number, o: { products: { basePrice: number }[]; }) => sum + o.products.reduce((s: number, p: { basePrice: number }) => s + Number(p.basePrice || 0), 0), 0);
    return NextResponse.json({ ok: true, metrics: { ordersCount, recentRevenue, lowStock } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: (error as unknown as { status: number }).status || 500 });
  }
}


