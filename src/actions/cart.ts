import { prisma } from '../lib/prisma';
import { CartItem } from '../types/cart';

export async function getServerCart(userId: string) {
  return await prisma.cartItem.findMany({
    where: { userId },
  });
}

export async function addToServerCart(userId: string, item: CartItem) {
  // Real-time inventory validation
  // If a variant is provided, validate against variant inventory
  // Otherwise, attempt to validate against a default single variant for the product (if present)
  let availableInventory: number | null = null;
  if ((item as unknown as CartItem).variant) {
    const variant = await prisma.productVariant.findUnique({ where: { id: (item as unknown as CartItem).variant as string } });
    availableInventory = variant?.inventory ?? null;
  } else {
    // Fallback: pick first variant for this product (if catalog uses variants)
    const firstVariant = await prisma.productVariant.findFirst({ where: { productId: item.id } });
    availableInventory = firstVariant?.inventory ?? null;
  }

  const existingForUserAndProduct = await prisma.cartItem.findFirst({
    where: { userId, productId: item.id },
  });

  if (availableInventory !== null) {
    const desiredQuantity = (existingForUserAndProduct?.quantity ?? 0) + item.quantity;
    if (desiredQuantity > availableInventory) {
      throw new Error('Insufficient inventory for this item');
    }
  }

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
