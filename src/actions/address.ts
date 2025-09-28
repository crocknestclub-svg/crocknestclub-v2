import { prisma } from '../lib/prisma';

export async function validateAddress(address: {
  line1: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}) {
  // Basic validation
  if (!address.line1 || !address.city || !address.state || !address.country || !address.zipCode) {
    return false;
  }
  // Optionally add external address validation API here
  return true;
}

export async function saveAddress(userId: string, address: {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}) {
  return await prisma.address.create({
    data: {
      userId,
      ...address,
    },
  });
}
