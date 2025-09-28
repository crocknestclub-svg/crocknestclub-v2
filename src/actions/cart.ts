import { prisma } from '../lib/prisma';
import { CartItem } from '../types/cart';

export async function getServerCart(userId: string) {
  return await prisma.cartItem.findMany({
    where: { userId },
  });
}

export async function addToServerCart(userId: string, item: CartItem) {
  // Real-time inventory validation can be added here
  // Only productId and quantity are used in CartItem schema
  const existing = await prisma.cartItem.findFirst({
    where: { userId, productId: item.id },
  });
  if (existing) {
    return await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + item.quantity },
    });
  } else {
    return await prisma.cartItem.create({
      data: {
        userId,
        productId: item.id,
        quantity: item.quantity,
      },
    });
  }
}

export async function removeFromServerCart(userId: string, productId: string) {
  return await prisma.cartItem.deleteMany({
    where: { userId, productId },
  });
}

export async function clearServerCart(userId: string) {
  return await prisma.cartItem.deleteMany({ where: { userId } });
}
