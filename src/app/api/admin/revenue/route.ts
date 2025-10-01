import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { assertAdmin } from '@/src/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    await assertAdmin(req);
    const start = req.nextUrl.searchParams.get('start');
    const end = req.nextUrl.searchParams.get('end');
    const startDate = start ? new Date(start) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = end ? new Date(end) : new Date();

    const orders = await prisma.order.findMany({
      where: { status: { in: ['PAID'] }, createdAt: { gte: startDate, lte: endDate } },
      include: { products: true },
    });
    const revenue = orders.reduce((sum: number, o: { products: { basePrice: number }[]; }) => sum + o.products.reduce((s: number, p: { basePrice: number }) => s + Number(p.basePrice || 0), 0), 0);
    const ordersCount = orders.length;

    // Approx conversion: orders / searches (proxy). If zero, return null.
    const searches = await prisma.searchEvent.count({ where: { createdAt: { gte: startDate, lte: endDate } } });
    const conversion = searches > 0 ? ordersCount / searches : null;

    return NextResponse.json({ ok: true, range: { start: startDate, end: endDate }, revenue, ordersCount, conversion });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: (error as { status?: number }).status || 500 });
  }
}


