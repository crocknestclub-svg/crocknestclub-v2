import React from "react";

export default function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg" />
      ))}
    </div>
  );
}
