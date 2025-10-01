"use client";
import { useEffect, useRef, useState } from "react";
import ProductGrid from "@/src/components/catalog/ProductGrid";

export default function ProductsInfinite() {
  const [page, setPage] = useState(2);
  const [items, setItems] = useState<unknown[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        const res = await fetch(`/api/products?page=${page}`);
        const data = await res.json();
        setItems(prev => [...prev, ...data.items]);
        setHasMore(data.items.length > 0);
        setPage(p => p + 1);
      }
    });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [page, hasMore]);

  if (!hasMore && items.length === 0) return null;
  return (
    <div>
      {items.length > 0 && <ProductGrid products={items as unknown as { id: string; name: string; images?: { url: string }[]; basePrice?: number }[]} />}
      <div ref={sentinel} className="h-10" />
    </div>
  );
}


