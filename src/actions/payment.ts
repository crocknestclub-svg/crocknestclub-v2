import { createPayment, instamojo } from '../lib/instamojo';

export async function requestPayment({
  purpose,
  amount,
  buyer_name,
  email,
  phone,
  redirect_url,
}: {
  purpose: string;
  amount: string;
  buyer_name: string;
  email: string;
  phone: string;
  redirect_url: string;
}) {
  return await createPayment({
    purpose,
    amount,
    buyer_name,
    email,
    phone,
    redirect_url,
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
