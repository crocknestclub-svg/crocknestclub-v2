import { Suspense } from "react";
import dynamic from "next/dynamic";
const ProductFilters = dynamic(() => import("../../components/catalog/ProductFilters"), { ssr: false, loading: () => <div className="h-40" /> });
const ProductSort = dynamic(() => import("../../components/catalog/ProductSort"), { ssr: false });
const ProductGrid = dynamic(() => import("../../components/catalog/ProductGrid"));
import SkeletonGrid from "../../components/ui/SkeletonGrid";
import { listProducts } from "@/src/actions/product";
import ProductsInfinite from "./products-infinite";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const search = await searchParams;
  const result = await listProducts({
    q: typeof search.q === 'string' ? search.q : undefined,
    sort: typeof search.sort === 'string' && ['relevance', 'price-asc', 'price-desc', 'newest', 'popularity'].includes(search.sort)
      ? (search.sort as "relevance" | "price-asc" | "price-desc" | "newest" | "popularity")
      : undefined,
    brand: typeof search.brand === 'string' ? search.brand : undefined,
    size: typeof search.size === 'string' ? search.size : undefined,
    color: typeof search.color === 'string' ? search.color : undefined,
    minPrice: typeof search.minPrice === 'string' ? Number(search.minPrice) : undefined,
    maxPrice: typeof search.maxPrice === 'string' ? Number(search.maxPrice) : undefined,
  });
  return (
    <main className="container mx-auto px-2 py-4">
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-1/4">
          <ProductFilters />
        </aside>
        <section className="w-full md:w-3/4">
          <ProductSort />
          <Suspense fallback={<SkeletonGrid />}>
            <ProductGrid
              products={
                Array.isArray((result as { items: unknown[] })?.items)
                  ? ((result as { items: unknown[] })?.items as { id: string; name: string; images?: { url: string }[]; basePrice?: number }[])
                  : []
              }
            />
            <ProductsInfinite />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
