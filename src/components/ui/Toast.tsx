"use client";
import { useState } from "react";

export default function Toast({ message, type = "info" }: { message: string; type?: "info" | "success" | "error" }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg text-white transition ${type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-gray-800"}`}
      onClick={() => setVisible(false)}>
      {message}
    </div>
  );
}
