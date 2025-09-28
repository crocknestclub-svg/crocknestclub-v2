"use client";
import React from "react";

export default function ProductSort() {
  // TODO: Connect to Zustand store and backend
  return (
    <div className="mb-4 flex items-center justify-between">
      <label className="font-medium">Sort by:</label>
      <select className="border rounded px-2 py-1">
        <option value="relevance">Relevance</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
}
