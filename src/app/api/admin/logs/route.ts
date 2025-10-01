import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { assertAdmin } from '@/src/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    await assertAdmin(req);
    const logs = await prisma.searchEvent.findMany({
      where: { query: { startsWith: 'audit:' } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ ok: true, logs });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: (error as unknown as { status: number }).status || 500 });
  }
}


