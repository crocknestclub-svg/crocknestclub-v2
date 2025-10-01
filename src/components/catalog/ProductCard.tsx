"use client";
import React, { useState } from "react";
import Image from "next/image";
import QuickViewModal from "../../components/catalog/QuickViewModal";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg p-2 flex flex-col items-center">
      <Image src={product.image} alt={product.name} width={160} height={160} className="object-cover rounded" />
      <h3 className="mt-2 font-semibold text-center">{product.name}</h3>
      <div className="text-primary font-bold">₹{product.price}</div>
      <button className="mt-2 px-3 py-1 bg-neutral-800 text-white rounded" onClick={() => setOpen(true)}>
        Quick View
      </button>
      {open && (
        // @ts-expect-error Fix type mismatch between Product types
        <QuickViewModal product={product} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
