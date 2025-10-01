import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/src/actions/product";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const q = searchParams.get("q") ?? undefined;
  const brand = searchParams.get("brand") ?? undefined;
  const size = searchParams.get("size") ?? undefined;
  const color = searchParams.get("color") ?? undefined;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sortParam = searchParams.get("sort");
  const allowedSorts = ["relevance", "price-asc", "price-desc", "newest", "popularity"] as const;
  type SortType = typeof allowedSorts[number];
  const sort = allowedSorts.includes(sortParam as SortType) ? (sortParam as SortType) : undefined;

  const data = await listProducts({
    q,
    sort,
    brand,
    size,
    color,
    page,
    pageSize: 24,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });
  return NextResponse.json(data);
}

