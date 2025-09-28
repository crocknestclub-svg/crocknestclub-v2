"use client";
import React, { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // TODO: Integrate Algolia or similar search API
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Simulate API call for suggestions
    setSuggestions([
      e.target.value + " Shirt",
      e.target.value + " Shoes",
      e.target.value + " Jacket"
    ]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for products..."
        className="w-full border rounded px-3 py-2"
      />
      {query && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border rounded shadow mt-1 z-10">
          {suggestions.map((s, i) => (
            <li key={i} className="px-3 py-2 cursor-pointer hover:bg-gray-100">{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
