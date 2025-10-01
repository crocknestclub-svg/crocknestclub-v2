import React, { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [view360, setView360] = useState(false);
  return (
    <div>
      <div className="mb-2">
        {!view360 ? (
          <div className="relative overflow-hidden rounded-lg" onMouseEnter={()=>setZoom(true)} onMouseLeave={()=>setZoom(false)} onTouchStart={()=>setZoom(v=>!v)}>
            <Image src={images[active]} alt="Product" width={400} height={400} className={`rounded-lg object-cover transition ${zoom? 'scale-110': ''}`} quality={typeof navigator !== 'undefined' && (navigator as unknown as { connection: { effectiveType?: string } }).connection && (navigator as unknown as { connection: { effectiveType?: string } }).connection.effectiveType?.includes('2g') ? 50 : 75} />
          </div>
        ) : (
          <div className="rounded-lg bg-black/5 aspect-square flex items-center justify-center text-sm text-gray-600">360° view placeholder</div>
        )}
      </div>
      <div className="flex gap-2">
        {images.map((img, i) => (
          <button key={i} onClick={() => setActive(i)} className={`border rounded ${active===i?'border-primary':'border-gray-300'}`}>
            <Image src={img} alt="Thumb" width={64} height={64} className="object-cover rounded" quality={60} />
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <button className="px-3 py-1 border rounded" onClick={()=>setView360(false)}>Images</button>
        <button className="px-3 py-1 border rounded" onClick={()=>setView360(true)}>360°</button>
      </div>
    </div>
  );
}
