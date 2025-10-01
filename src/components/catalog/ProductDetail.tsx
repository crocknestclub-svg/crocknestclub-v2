import React, { ReactNode } from "react";
import ProductGallery from "../../components/catalog/ProductGallery";
import ProductVariants from "../../components/catalog/ProductVariants";
import ProductTabs from "../../components/catalog/ProductTabs";
import ProductReviews from "../../components/catalog/ProductReviews";
import RelatedProducts from "../../components/catalog/RelatedProducts";

export default function ProductDetail({ product }: { product: {
  id: string;
  name: ReactNode; images: { url: string }[]; variants: {
    color: string;
    size: string; name: string; price: number; inventory: number 
}[]; reviews: {
  user: string; rating: number; comment: string 
}[]; related: { id: string; name: string; images?: { url: string }[]; basePrice?: number }[] 
} }) {
  const images = (product?.images?.map((i: { url: string }) => i.url) ?? ["/next.svg"]) as string[];
  const variants = product?.variants ?? [];
  const reviews = product?.reviews ?? [];
  const related = product?.related ?? [];

  return (
    <div className="max-w-5xl mx-auto py-8 px-2 grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProductGallery images={images} />
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        {/* Fix: Map variants to include required size and color properties */}
        <ProductVariants
          variants={variants.map((v) => ({
            ...v,
            size: v.size ?? "One Size",
            color: v.color ?? "Default",
          }))}
        />
        {/* Fix: ProductTabs expects a description prop, but product.description does not exist */}
        <ProductTabs description={typeof product.name === "string" ? product.name : ""} />
        {/* Fix: Map reviews to include required user property and pass a dummy productId */}
        <ProductReviews
          reviews={reviews.map((r) => ({
            ...r,
            user: r.user ?? "Anonymous",
          }))}
          productId={product.id ?? ""}
        />
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
