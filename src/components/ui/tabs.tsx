"use client";
import { useState } from "react";

export function Tabs({ value, onValueChange, children, className }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex gap-2 border-b ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function Tab({ value, label }: { value: string; label: string }) {
  // This is a stub. Actual selection logic is handled in Tabs parent.
  return (
    <button type="button" className="px-4 py-2 text-sm font-medium rounded-t hover:bg-gray-100 focus:outline-none">
      {label}
    </button>
  );
}
