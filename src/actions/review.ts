"use server";
import { prisma } from "../lib/prisma";

export async function listReviews(productId: string) {
  return prisma.review.findMany({ where: { productId }, orderBy: { createdAt: "desc" } });
}

export async function createReview({ productId, userId, rating, comment }: { productId: string; userId?: string; rating: number; comment: string; }) {
  return prisma.review.create({ data: { productId, userId, rating, comment } });
}


