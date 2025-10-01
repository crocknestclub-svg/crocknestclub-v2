import axios from 'axios';
import crypto from 'crypto';

// Prefer new env names, fall back to legacy if present
const API_KEY = process.env.PRIVATE_KEY || process.env.INSTAMOJO_API_KEY;
const AUTH_TOKEN = process.env.PRIVATE_AUTH_TOKEN || process.env.INSTAMOJO_AUTH_TOKEN;
const WEBHOOK_SECRET = process.env.PRIVATE_SALT || process.env.INSTAMOJO_WEBHOOK_SECRET;

export const instamojo = axios.create({
  baseURL: 'https://www.instamojo.com/api/1.1/',
  headers: {
    'X-Api-Key': API_KEY,
    'X-Auth-Token': AUTH_TOKEN,
  },
});

export function verifyInstamojoSignature(rawBody: string, signatureHeader?: string | null): boolean {
  if (!WEBHOOK_SECRET || !signatureHeader) return false;
  try {
    const digest = crypto.createHmac('sha1', WEBHOOK_SECRET).update(rawBody).digest('hex');
    return digest === signatureHeader;
  } catch {
    return false;
  }
}

export async function createPayment({
  purpose,
  amount,
  buyer_name,
  email,
  phone,
  redirect_url,
  allow_repeated_payments = false,
  webhook,
  custom_order_id,
}: {
  purpose: string;
  amount: string;
  buyer_name: string;
  email: string;
  phone: string;
  redirect_url: string;
  allow_repeated_payments?: boolean;
  webhook?: string;
  custom_order_id?: string;
}) {
  const response = await instamojo.post('/payment-requests/', {
    purpose,
    amount,
    buyer_name,
    email,
    phone,
    redirect_url,
    allow_repeated_payments,
    webhook,
    custom_order_id,
  });
  return response.data;
}
