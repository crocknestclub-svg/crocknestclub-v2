import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/src/actions/search";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const items = await searchProducts(q, 8);
  return NextResponse.json({ items });
}


