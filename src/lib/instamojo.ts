import axios from 'axios';

const API_KEY = process.env.INSTAMOJO_API_KEY;
const AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN;

export const instamojo = axios.create({
  baseURL: 'https://www.instamojo.com/api/1.1/',
  headers: {
    'X-Api-Key': API_KEY,
    'X-Auth-Token': AUTH_TOKEN,
  },
});

export async function createPayment({
  purpose,
  amount,
  buyer_name,
  email,
  phone,
  redirect_url,
  allow_repeated_payments = false,
}: {
  purpose: string;
  amount: string;
  buyer_name: string;
  email: string;
  phone: string;
  redirect_url: string;
  allow_repeated_payments?: boolean;
}) {
  const response = await instamojo.post('/payment-requests/', {
    purpose,
    amount,
    buyer_name,
    email,
    phone,
    redirect_url,
    allow_repeated_payments,
  });
  return response.data;
}
