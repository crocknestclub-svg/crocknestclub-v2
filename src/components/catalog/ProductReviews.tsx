"use client";
import React, { useState } from "react";
import { createReview } from "@/src/actions/review";

interface Review {
  user: string;
  rating: number;
  comment: string;
}

export default function ProductReviews({ reviews, productId }: { reviews: Review[]; productId?: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  return (
    <div className="mb-4">
      <h2 className="font-bold text-lg mb-2">Reviews</h2>
      {reviews.length === 0 ? (
        <div className="text-gray-500">No reviews yet.</div>
      ) : (
        <ul className="space-y-2">
          {reviews.map((r, i) => (
            <li key={i} className="border rounded p-2">
              <div className="font-semibold">{r.user}</div>
              <div className="text-yellow-500">{"★".repeat(r.rating)}</div>
              <div>{r.comment}</div>
            </li>
          ))}
        </ul>
      )}
      {productId && (
        <form className="mt-4 space-y-2" onSubmit={async (e)=>{ e.preventDefault(); await createReview({ productId, rating, comment }); setComment(""); }}>
          <div>
            <label className="block text-sm mb-1">Rating</label>
            <select className="border rounded px-2 py-1" value={rating} onChange={e=>setRating(Number(e.target.value))}>
              {[5,4,3,2,1].map(r=> <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Comment</label>
            <textarea className="w-full border rounded px-2 py-1" value={comment} onChange={e=>setComment(e.target.value)} />
          </div>
          <button className="px-4 py-2 bg-neutral-800 text-white rounded" type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
}
