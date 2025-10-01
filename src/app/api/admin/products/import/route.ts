import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { assertAdmin } from '@/src/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    await assertAdmin(req);
    const text = await req.text();
    const [header, ...lines] = text.split(/\r?\n/);
    const cols = header.split(',');
    const idx = (k: string) => cols.indexOf(k);
    let created = 0;
    for (const line of lines) {
      if (!line.trim()) continue;
      const parts = line.split(',');
      const id = parts[idx('id')];
      const name = JSON.parse(parts[idx('name')]);
      const slug = parts[idx('slug')];
      const status = parts[idx('status')] || 'DRAFT';
      const basePrice = parts[idx('basePrice')];
      await prisma.product.upsert({
        where: { id },
        create: { id, name, slug, status, basePrice: new prisma.Prisma.Decimal(basePrice), categoryId: (await ensureDefaultCategory()).id },
        update: { name, slug, status, basePrice: new prisma.Prisma.Decimal(basePrice) },
      });
      created++;
    }
    return NextResponse.json({ ok: true, created });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: (error as { status?: number }).status || 500 });
  }
}

async function ensureDefaultCategory() {
  const existing = await prisma.category.findFirst();
  if (existing) return existing;
  return prisma.category.create({ data: { name: 'General' } });
}


