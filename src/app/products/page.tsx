import { Suspense } from "react";
import ProductFilters from "../../components/catalog/ProductFilters";
import ProductSort from "../../components/catalog/ProductSort";
import ProductGrid from "../../components/catalog/ProductGrid";
import SkeletonGrid from "../../components/ui/SkeletonGrid";

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-2 py-4">
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-1/4">
          <ProductFilters />
        </aside>
        <section className="w-full md:w-3/4">
          <ProductSort />
          <Suspense fallback={<SkeletonGrid />}>
            <ProductGrid />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
