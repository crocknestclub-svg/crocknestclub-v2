import { createPayment, instamojo } from '../lib/instamojo';

export async function requestPayment({
  purpose,
  amount,
  buyer_name,
  email,
  phone,
  redirect_url,
  webhook,
  custom_order_id,
}: {
  purpose: string;
  amount: string;
  buyer_name: string;
  email: string;
  phone: string;
  redirect_url: string;
  webhook?: string;
  custom_order_id?: string;
}) {
  return await createPayment({
    purpose,
    amount,
    buyer_name,
    email,
    phone,
    redirect_url,
    webhook,
    custom_order_id,
  });
}

export async function getPaymentStatus(paymentRequestId: string) {
  const response = await instamojo.get(`/payment-requests/${paymentRequestId}/`);
  return response.data;
}

export async function refundPayment(paymentId: string, type: 'QFL' | 'TNR' = 'QFL') {
  // QFL: Quick Full Refund, TNR: Transaction Not Received
  const response = await instamojo.post(`/refunds/`, {
    payment_id: paymentId,
    type,
  });
  return response.data;
}

export async function pollPaymentStatus(paymentRequestId: string, attempts = 5, intervalMs = 2000) {
  for (let i = 0; i < attempts; i++) {
    const status = await getPaymentStatus(paymentRequestId);
    const s = status?.payment_request?.payment?.status || status?.payment_request?.status;
    if (s === 'Credit' || s === 'Completed' || s === 'Failed' || s === 'Cancelled') {
      return status;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return null;
}
