import SearchBar from "../../components/catalog/SearchBar";

export default function SearchPage() {
  return (
    <main className="container mx-auto px-2 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Products</h1>
      <SearchBar />
      {/* TODO: Show search results and analytics */}
    </main>
  );
}
