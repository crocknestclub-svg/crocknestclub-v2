import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { assertAdmin } from '@/src/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    await assertAdmin(req);
    const products = await prisma.product.findMany({ include: { variants: true } });
    const rows = products.map((p: { id: string; name: string; slug: string; status: string; basePrice: { toString: () => string; }; }) => ({ id: p.id, name: p.name, slug: p.slug, status: p.status, basePrice: p.basePrice.toString() }));
    const header = 'id,name,slug,status,basePrice';
    const csv = [header, ...rows.map((r: { id: string; name: string; slug: string; status: string; basePrice: string; }) => `${r.id},${JSON.stringify(r.name)},${r.slug},${r.status},${r.basePrice}`)].join('\n');
    return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="products.csv"' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}


