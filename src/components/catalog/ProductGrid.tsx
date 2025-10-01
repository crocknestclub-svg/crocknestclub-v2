import React from "react";
import ProductCard from "../../components/catalog/ProductCard";

export default function ProductGrid({ products }: { products: Array<{ id: string; name: string; images?: { url: string }[]; basePrice?: number }> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={{
          id: product.id,
          name: product.name,
          price: Number(product.basePrice ?? 0),
          image: product.images?.[0]?.url ?? "/next.svg",
        }} />
      ))}
    </div>
  );
}
