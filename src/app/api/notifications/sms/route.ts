import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin } from '@/src/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    await assertAdmin(req);
    const { to, text } = await req.json();
    if (!to || !text) return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    // Stub: integrate with SMS provider (Twilio, etc.)
    console.log('SMS', to, text);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}


