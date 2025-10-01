"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductSort() {
  const router = useRouter();
  const params = useSearchParams();
  const onChange = (value: string) => {
    const sp = new URLSearchParams(params as unknown as string);
    sp.set('sort', value);
    router.push(`/products?${sp.toString()}`);
  };
  return (
    <div className="mb-4 flex items-center justify-between">
      <label className="font-medium">Sort by:</label>
      <select className="border rounded px-2 py-1" onChange={(e)=>onChange(e.target.value)} defaultValue={params.get('sort') ?? 'relevance'}>
        <option value="relevance">Relevance</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
}
