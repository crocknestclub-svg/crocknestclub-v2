import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { assertAdmin } from '@/src/lib/adminAuth';
import { logAudit } from '@/src/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const token = await assertAdmin(req);
    const { productIds } = await req.json();
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ ok: false, error: 'No product ids' }, { status: 400 });
    }
    const result = await prisma.product.updateMany({ where: { id: { in: productIds } }, data: { status: 'PUBLISHED' } });
    await logAudit({ actorId: (token as unknown as { sub: string }).sub, action: 'bulk_publish', target: `${productIds.length}_products` });
    return NextResponse.json({ ok: true, count: result.count });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: (error as unknown as { status: number }).status || 500 });
  }
}


