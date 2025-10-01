"use server";
import { prisma } from "../lib/prisma";
import { unstable_cache } from "next/cache";
import { getCache, setCache } from "@/src/lib/cache";

export type ProductListParams = {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  size?: string;
  color?: string;
  sort?: "relevance" | "price-asc" | "price-desc" | "newest" | "popularity";
  page?: number;
  pageSize?: number;
};

export async function listProducts(params: ProductListParams = {}) {
  const { q, categoryId, minPrice, maxPrice, brand, size, color, sort = "relevance", page = 1, pageSize = 24 } = params;

  // Remove explicit type annotation to fix "Cannot find name 'ProductWhereInput'"
  const where = {} as {
    OR?: { name: { contains: string; mode: "insensitive" }; description: { contains: string; mode: "insensitive" } }[];
    categoryId?: string;
    basePrice?: { gte?: number; lte?: number };
    brand?: { equals: string; mode: "insensitive" };
    variants?: { some: { size?: { equals: string }; color?: { equals: string; mode: "insensitive" } } };
  };
  if (q) {
    where.OR = [
      {
        name: { contains: q, mode: "insensitive" },
        description: {
          contains: "",
          mode: "insensitive"
        }
      },
      {
        description: { contains: q, mode: "insensitive" },
        name: {
          contains: "",
          mode: "insensitive"
        }
      }
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {
      gte: minPrice ?? undefined,
      lte: maxPrice ?? undefined,
    };
  }
  if (brand) where.brand = { equals: brand, mode: "insensitive" };
  if (size || color) where.variants = {
    some: {
      ...(size ? { size: { equals: size } } : {}),
      ...(color ? { color: { equals: color, mode: "insensitive" } } : {}),
    },
  };

  const orderBy =
    sort === "price-asc" ? { basePrice: "asc" } :
    sort === "price-desc" ? { basePrice: "desc" } :
    sort === "newest" ? { createdAt: "desc" } :
    sort === "popularity" ? { viewCount: "desc" } :
    { createdAt: "desc" };

  const cacheKey = `products:${JSON.stringify({ where, orderBy, page, pageSize })}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const run = async () => {
    const [items, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize, include: { images: true } }),
      prisma.product.count({ where }),
    ]);
    const result = { items, total, page, pageSize };
    await setCache(cacheKey, result, 60);
    return result;
  };
  const cachedFn = unstable_cache(run, [cacheKey], { revalidate: 60, tags: ["products"] });
  return cachedFn();
}

export async function getProductBySlug(slug: string) {
  const cacheKey = `product:${slug}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const run = async () => {
    const product = await prisma.product.findUnique({ where: { slug }, include: { images: true, variants: true, reviews: true, category: true } });
    if (!product) {
      await setCache(cacheKey, null, 120);
      return null;
    }
    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id } },
      take: 6,
      include: { images: true }
    });
    const result = { ...product, related };
    await setCache(cacheKey, result, 120);
    return result;
  };
  return unstable_cache(run, [cacheKey], { revalidate: 120, tags: ["product", slug] })();
}