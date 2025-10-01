"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const apply = (updates: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(params as unknown as string);
    Object.entries(updates).forEach(([k, v]) => {
      if (!v) sp.delete(k); else sp.set(k, v);
    });
    router.push(`/products?${sp.toString()}`);
  };
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Filters</h2>
      {/* Price Range */}
      <div>
        <label className="block mb-1">Price</label>
        <input type="range" min={0} max={10000} className="w-full" onChange={(e)=>apply({ minPrice: e.target.value })} />
      </div>
      {/* Size */}
      <div>
        <label className="block mb-1">Size</label>
        <div className="flex gap-2">
          {['XS','S','M','L','XL'].map(size => (
            <button key={size} className="px-2 py-1 border rounded" onClick={()=>apply({ size })}>{size}</button>
          ))}
        </div>
      </div>
      {/* Color */}
      <div>
        <label className="block mb-1">Color</label>
        <div className="flex gap-2">
          {['Red','Blue','Green','Black','White'].map(color => (
            <button key={color} className="px-2 py-1 border rounded" style={{background:color.toLowerCase()}} onClick={()=>apply({ color })}>{color}</button>
          ))}
        </div>
      </div>
      {/* Brand */}
      <div>
        <label className="block mb-1">Brand</label>
        <select className="w-full border rounded px-2 py-1" onChange={(e)=>apply({ brand: e.target.value })}>
          <option>All Brands</option>
          <option>Brand A</option>
          <option>Brand B</option>
        </select>
      </div>
    </div>
  );
}
