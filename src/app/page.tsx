import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MobileNav from "../components/layout/MobileNav";
import Breadcrumb from "../components/layout/Breadcrumb";
import Image from "next/image";

export default function HomePage() {
  const categories = [
    { name: "Oversized Tees", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&auto=format&fit=crop" },
    { name: "Jackets", img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=400&auto=format&fit=crop" },
    { name: "Shirts", img: "https://images.unsplash.com/photo-1548883354-92c3e6e2ed6f?q=80&w=400&auto=format&fit=crop" },
    { name: "Sneakers", img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=400&auto=format&fit=crop" },
    { name: "Loungewear", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop" },
  ];
  const products = [
    { id: "p1", name: "Kung Fu Panda: Ramen", price: 1299, img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop", badge: "OVERSIZED FIT", meta: "Oversized Shirts" },
    { id: "p2", name: "Ghost Rider: Hell Cycle Club", price: 2599, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop", badge: "PREMIUM HEAVY", meta: "Varsity Jackets" },
    { id: "p3", name: "Looney Tunes: That's All Folks", price: 1599, img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop", badge: "RELAXED", meta: "Men Relaxed Shirts" },
    { id: "p4", name: "Oversized T-Shirt: Regal", price: 1499, img: "https://images.unsplash.com/photo-1548883354-92c3e6e2ed6f?q=80&w=1200&auto=format&fit=crop", badge: "HEAVY GAUGE", meta: "Oversized T-Shirts" },
    { id: "p5", name: "Retro Sneaker 90s", price: 3299, img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop", badge: "NEW", meta: "Sneakers" },
    { id: "p6", name: "Everyday Joggers", price: 1399, img: "https://images.unsplash.com/photo-1602810318383-9e3d77e5d0d2?q=80&w=1200&auto=format&fit=crop", badge: "SOFT FLEECE", meta: "Loungewear" },
    { id: "p7", name: "Classic Denim Shirt", price: 1899, img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop", badge: "BESTSELLER", meta: "Shirts" },
    { id: "p8", name: "Monochrome Hoodie", price: 1799, img: "https://images.unsplash.com/photo-1520975940209-98c1d451c0b1?q=80&w=1200&auto=format&fit=crop", badge: "OVERSIZED", meta: "Hoodies" },
  ];

  return (
    <main className="min-h-screen bg-bg">
      <Header />
      <MobileNav />
      <div className="container">
        <Breadcrumb items={["Home"]} />
        {/* Hero Section */}
        <section className="hero mb-8">
          <div className="slides flex gap-4 overflow-x-auto pb-8">
            {products.slice(0, 3).map((p) => (
              <div key={p.id} className="slide min-w-[90vw] max-h-[520px] rounded-lg overflow-hidden shadow-md bg-gray-200">
                <Image src={p.img} alt={p.name} width={1200} height={520} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </section>
        {/* Category Grid */}
        <section className="mb-8">
          <h2 className="h2 mb-4">Shop by Category</h2>
          <div className="categories flex gap-3 overflow-x-auto pb-2">
            {categories.map(cat => (
              <div key={cat.name} className="cat-card flex-none bg-surface border border-line rounded-lg w-[140px] p-3 shadow-sm transition-transform hover:-translate-y-1">
                <div className="cat-thumb aspect-square rounded-lg overflow-hidden bg-gray-200 mb-2">
                  <Image src={cat.img} alt={cat.name} width={140} height={140} className="object-cover w-full h-full" />
                </div>
                <div className="h3">{cat.name}</div>
                <div className="subtle small">Explore</div>
              </div>
            ))}
          </div>
        </section>
        {/* Products Grid */}
        <section className="mb-8">
          <h2 className="h2 mb-4">New Arrivals</h2>
          <div className="products-grid grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map(p => (
              <div key={p.id} className="product-card bg-surface border border-line rounded-lg overflow-hidden transition-transform hover:-translate-y-1 shadow-sm">
                <div className="product-media relative aspect-[3/4] overflow-hidden bg-gray-200">
                  <Image src={p.img} alt={p.name} width={300} height={400} className="object-cover w-full h-full" />
                  <span className="badge absolute top-2 left-2 bg-black text-white text-xs rounded-full px-2 py-1 font-bold">{p.badge}</span>
                </div>
                <div className="product-body p-3">
                  <div className="title font-semibold mb-1">{p.name}</div>
                  <div className="meta text-muted text-sm mb-2">{p.meta}</div>
                  <div className="price-row flex items-center justify-between mt-3">
                    <div className="price font-bold">₹ {p.price}</div>
                    <button className="btn btn-primary">Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
