import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { sendOrderConfirmation } from '@/src/actions/confirmation';
import { generateInvoice } from '@/src/actions/invoice';
import { verifyInstamojoSignature } from '@/src/lib/instamojo';
import { logPaymentEvent } from '@/src/lib/paymentAnalytics';

export async function POST(req: NextRequest) {
  try {
    // Instamojo sends x-www-form-urlencoded body with signature header
    const rawBody = await req.text();
    const signature = req.headers.get('x-instamojo-signature') || req.headers.get('X-Instamojo-Signature');
    if (!verifyInstamojoSignature(rawBody, signature)) {
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
    }

    const form = new URLSearchParams(rawBody);
    const paymentStatus = String(form.get('status') || '');
    const buyerEmail = String(form.get('buyer') || form.get('buyer_email') || '');
    const paymentId = String(form.get('payment_id') || '');
    const orderId = String(form.get('custom_order_id') || '');

    if (!orderId) {
      return NextResponse.json({ ok: false, error: 'Missing order id' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { products: true, user: true } });
    if (!order) {
      return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
    }

    // Update order status based on payment
    const nextStatus = paymentStatus === 'Credit' ? 'PAID' : 'FAILED';
    await prisma.order.update({ where: { id: orderId }, data: { status: nextStatus } });
    logPaymentEvent({ type: 'webhook', orderId, paymentId, status: paymentStatus });

    if (nextStatus === 'PAID') {
      // Send confirmation email
      await sendOrderConfirmation({ email: buyerEmail || order.user?.email || '', orderId });

      // Generate invoice (basic)
      const total = order.products.reduce((sum: number, p: { basePrice: number; }) => sum + Number(p.basePrice || 0), 0);
      await generateInvoice({
        orderId,
        user: { name: order.user?.name || 'Customer', email: buyerEmail || order.user?.email || '' },
        products: order.products.map((p: { name: string; basePrice: number; }) => ({ name: p.name, price: Number(p.basePrice), quantity: 1 })),
        total,
        address: '',
      });
    }

    return NextResponse.json({ ok: true, orderId, paymentId, status: paymentStatus });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}


