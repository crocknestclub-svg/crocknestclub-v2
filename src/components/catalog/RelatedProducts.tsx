import React from "react";
import ProductCard from "../../components/catalog/ProductCard";


export default function RelatedProducts({ products }: { products: Array<{ id: string; name: string; images?: { url: string }[]; basePrice?: number }> }) {
  if (!products || products.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="font-bold text-lg mb-2">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p, i) => (
          <ProductCard
            key={i}
            product={{
              id: p.id,
              name: p.name,
              price: typeof p.basePrice === "number" ? p.basePrice : 0,
              image: p.images?.[0]?.url ?? "/next.svg"
            }}
          />
        ))}
      </div>
    </div>
  );
}
