import { NextRequest, NextResponse } from 'next/server';

const subscriptions = new Set<unknown>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    subscriptions.add(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export function getSubscriptions() {
  return Array.from(subscriptions);
}


