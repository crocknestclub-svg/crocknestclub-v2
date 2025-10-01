import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus } from '@/src/actions/payment';
import { logPaymentEvent } from '@/src/lib/paymentAnalytics';

export async function GET(_req: NextRequest, { params }: { params: { paymentRequestId: string } }) {
  try {
    const { paymentRequestId } = params;
    if (!paymentRequestId) {
      return NextResponse.json({ ok: false, error: 'Missing payment request id' }, { status: 400 });
    }
    const status = await getPaymentStatus(paymentRequestId);
    const s = status?.payment_request?.payment?.status || status?.payment_request?.status;
    logPaymentEvent({ type: 'status_check', paymentRequestId, status: s });
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}


