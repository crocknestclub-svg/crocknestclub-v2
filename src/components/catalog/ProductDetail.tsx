import React from "react";
import ProductGallery from "../../components/catalog/ProductGallery";
import ProductVariants from "../../components/catalog/ProductVariants";
import ProductTabs from "../../components/catalog/ProductTabs";
import ProductReviews from "../../components/catalog/ProductReviews";
import RelatedProducts from "../../components/catalog/RelatedProducts";

export default function ProductDetail() {
  // TODO: Accept product prop and fetch data
  const product = {
    name: "Sample Product",
    images: ["/public/globe.svg", "/public/next.svg"],
    variants: [
      { size: "M", color: "Red", inventory: 10 },
      { size: "L", color: "Blue", inventory: 5 }
    ],
    description: "A trendy product for demo.",
    reviews: [],
    related: []
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-2 grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProductGallery images={product.images} />
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <ProductVariants variants={product.variants} />
        <ProductTabs description={product.description} />
        <ProductReviews reviews={product.reviews} />
        <RelatedProducts products={product.related} />
      </div>
    </div>
  );
}
