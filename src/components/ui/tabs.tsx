"use client";

export function Tabs({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex gap-2 border-b ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function Tab({ label }: { label: string }) {
  // This is a stub. Actual selection logic is handled in Tabs parent.
  return (
    <button type="button" className="px-4 py-2 text-sm font-medium rounded-t hover:bg-gray-100 focus:outline-none">
      {label}
    </button>
  );
}
