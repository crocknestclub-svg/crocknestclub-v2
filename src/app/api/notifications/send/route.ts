import { NextRequest, NextResponse } from 'next/server';
import { broadcast } from '@/src/app/api/notifications/stream/route';
import { assertAdmin } from '@/src/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    await assertAdmin(req);
    const body = await req.json();
    broadcast(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}


