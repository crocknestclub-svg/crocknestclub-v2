"use server";
import { prisma } from "../lib/prisma";

export async function searchProducts(q: string, limit = 8) {
  const items = await prisma.product.findMany({
    where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { images: true },
  });
  await prisma.searchEvent.create({ data: { query: q, resultsCount: items.length } });
  return items;
}

export async function suggestQueries(q: string) {
  // naive suggestions from product names; for real use, switch to Algolia
  const items = await prisma.product.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { name: true },
  });
  return Array.from(new Set(items.map((i: { name: string; }) => i.name)));
}


