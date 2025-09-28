import React from "react";
import ProductCard from "../../components/catalog/ProductCard";


interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="font-bold text-lg mb-2">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </div>
    </div>
  );
}
