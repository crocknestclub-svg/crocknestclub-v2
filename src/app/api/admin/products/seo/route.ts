import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { assertAdmin } from '@/src/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    await assertAdmin(req);
    const { productIds } = await req.json();
    const prods = await prisma.product.findMany({ where: { id: { in: productIds } } });
    for (const p of prods) {
      const metaTitle = p.metaTitle || `${p.name} | Crocknestclub`;
      const metaDescription = p.metaDescription || `Shop ${p.name} at Crocknestclub. Quality and style delivered.`;
      await prisma.product.update({ where: { id: p.id }, data: { metaTitle, metaDescription } });
    }
    return NextResponse.json({ ok: true, count: prods.length });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: (error as { status?: number }).status || 500 });
  }
}


