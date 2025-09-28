import React, { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="mb-2">
        <Image src={images[active]} alt="Product" width={400} height={400} className="rounded-lg object-cover" />
      </div>
      <div className="flex gap-2">
        {images.map((img, i) => (
          <button key={i} onClick={() => setActive(i)} className={`border rounded ${active===i?'border-primary':'border-gray-300'}`}>
            <Image src={img} alt="Thumb" width={64} height={64} className="object-cover rounded" />
          </button>
        ))}
      </div>
      {/* TODO: Add zoom and 360° view */}
    </div>
  );
}
