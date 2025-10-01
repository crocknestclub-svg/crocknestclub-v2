import ProductDetail from "../../../components/catalog/ProductDetail";


export default async function ProductDetailPage() {
  const product = await getProductBySlug();

  // Ensure product has all required properties for ProductDetail
  if (product == null) {
    // You might want to handle not found here, e.g. throw or return a 404 component
    return <div>Product not found</div>;
  }

  // Fill in missing properties with defaults if necessary
  const fullProduct = {
    id: (product as { id: string }).id ?? "",
    name: (product as { name: string }).name ?? "",
    images: (product as { images: { url: string }[] }).images ?? [],
    basePrice: (product as { basePrice: number }).basePrice ?? 0,
    variants: (product as { variants: { color: string; size: string; name: string; price: number; inventory: number }[] }).variants ?? [],
    reviews: (product as { reviews: { user: string; rating: number; comment: string }[] }).reviews ?? [],
    related: (product as { related: { id: string; name: string; images?: { url: string }[]; basePrice?: number }[] }).related ?? [],
  };

  return <ProductDetail product={fullProduct} />;
}
function getProductBySlug() {
  throw new Error("Function not implemented.");
}

