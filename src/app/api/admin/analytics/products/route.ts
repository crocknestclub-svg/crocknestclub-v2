import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { assertAdmin } from '@/src/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    await assertAdmin(req);
    const top = await prisma.product.findMany({ orderBy: { viewCount: 'desc' }, take: 10 });
    const recent = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
    return NextResponse.json({ ok: true, top, recent });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: (error as unknown as { status: number }).status || 500 });
  }
}


