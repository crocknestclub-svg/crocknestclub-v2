import { NextRequest, NextResponse } from 'next/server';
import { requestPayment } from '@/src/actions/payment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payment = await requestPayment(body);
    return NextResponse.json({ ok: true, payment });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}


