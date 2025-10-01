import { NextRequest, NextResponse } from 'next/server';
import { validateAddress } from '@/src/actions/address';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const ok = await validateAddress(body);
  return NextResponse.json({ ok });
}


