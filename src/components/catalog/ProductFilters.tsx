"use client";
import React from "react";

export default function ProductFilters() {
  // TODO: Connect to Zustand store and backend
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Filters</h2>
      {/* Price Range */}
      <div>
        <label className="block mb-1">Price</label>
        <input type="range" min={0} max={10000} className="w-full" />
      </div>
      {/* Size */}
      <div>
        <label className="block mb-1">Size</label>
        <div className="flex gap-2">
          {['XS','S','M','L','XL'].map(size => (
            <button key={size} className="px-2 py-1 border rounded">{size}</button>
          ))}
        </div>
      </div>
      {/* Color */}
      <div>
        <label className="block mb-1">Color</label>
        <div className="flex gap-2">
          {['Red','Blue','Green','Black','White'].map(color => (
            <button key={color} className="px-2 py-1 border rounded" style={{background:color.toLowerCase()}}>{color}</button>
          ))}
        </div>
      </div>
      {/* Brand */}
      <div>
        <label className="block mb-1">Brand</label>
        <select className="w-full border rounded px-2 py-1">
          <option>All Brands</option>
          <option>Brand A</option>
          <option>Brand B</option>
        </select>
      </div>
    </div>
  );
}
