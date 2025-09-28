import { prisma } from '../lib/prisma';

export async function createOrder({
  userId,
  products,
  status = 'PENDING',
}: {
  userId?: string;
  products: string[];
  address: string;
  status?: string;
}) {
  return await prisma.order.create({
    data: {
      userId,
      products: { connect: products.map(id => ({ id })) },
      status,
      // Optionally store address in a separate Address model
    },
  });
}

export async function getOrderStatus(orderId: string) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

export async function refundOrder(orderId: string) {
  // Add Instamojo refund API integration here
  // Update order status to REFUNDED
  return await prisma.order.update({
    where: { id: orderId },
    data: { status: 'REFUNDED' },
  });
}
