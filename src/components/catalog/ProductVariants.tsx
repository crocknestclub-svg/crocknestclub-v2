import React, { useState } from "react";

interface Variant {
  size: string;
  color: string;
  inventory: number;
}

export default function ProductVariants({ variants }: { variants: Variant[] }) {
  const [selected, setSelected] = useState(variants[0]);
  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        {variants.map((v, i) => (
          <button key={i} onClick={() => setSelected(v)} className={`px-2 py-1 border rounded ${selected===v?'bg-primary text-white':'bg-white'}`}>{v.size} / {v.color}</button>
        ))}
      </div>
      <div className="text-sm">Inventory: <span className="font-bold">{selected.inventory}</span></div>
    </div>
  );
}
