import React from "react";

interface Review {
  user: string;
  rating: number;
  comment: string;
}

export default function ProductReviews({ reviews }: { reviews: Review[] }) {
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
      {/* TODO: Add review form and ratings system */}
    </div>
  );
}
