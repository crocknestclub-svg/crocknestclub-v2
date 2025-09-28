"use client";
import React from "react";

import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-lg" onClick={onClose}>×</button>
        <h2 className="font-bold text-xl mb-2">{product.name}</h2>
  <Image src={product.image} alt={product.name} width={400} height={192} className="w-full object-cover rounded mb-2" />
        <div className="font-bold text-primary mb-2">₹{product.price}</div>
        <p className="text-sm text-gray-600 mb-2">Quick details about the product...</p>
        <button className="mt-2 px-4 py-2 bg-neutral-800 text-white rounded w-full" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
