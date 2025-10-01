import nodemailer from 'nodemailer';
import { prisma } from '../lib/prisma';

export async function sendOrderConfirmation({
  email,
  orderId,
}: {
  email: string;
  orderId: string;
}) {
  // Configure nodemailer or use Resend API
  // This is a placeholder for sending confirmation email
  // Replace with actual email provider integration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Order Confirmation',
    text: `Your order ${orderId} has been placed successfully.`,
  });

  // Record basic payment analytics event
  await prisma.searchEvent.create({
    data: {
      userId: undefined,
      query: `order_confirmation:${orderId}`,
      resultsCount: 1,
    },
  });
}
