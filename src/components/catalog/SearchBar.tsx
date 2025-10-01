"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // TODO: Integrate Algolia or similar search API
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (!v) { setSuggestions([]); return; }
    const res = await fetch(`/api/search?q=${encodeURIComponent(v)}`);
    const data = await res.json();
    setSuggestions(data.items.map((i: { name: string }) => i.name));
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for products..."
        className="w-full border rounded px-3 py-2"
        onKeyDown={(e)=>{ if (e.key === 'Enter') router.push(`/products?q=${encodeURIComponent(query)}`)}}
      />
      {query && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border rounded shadow mt-1 z-10">
          {suggestions.map((s, i) => (
            <li key={i} className="px-3 py-2 cursor-pointer hover:bg-gray-100" onClick={()=> router.push(`/products?q=${encodeURIComponent(s)}`)}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
