import React from "react";
import ProductCard from "../../components/catalog/ProductCard";

// TODO: Fetch products from backend with filters, sort, pagination
export default function ProductGrid() {
  // Placeholder products
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    name: `Product ${i+1}`,
    price: 999 + i * 100,
    image: "/public/globe.svg"
  }));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
