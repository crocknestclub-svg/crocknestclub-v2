"use client";
import { Button } from "@/components/ui/button";
import { LucideShoppingCart, LucideSearch } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full px-4 py-2 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50">
      <div className="font-bold text-xl tracking-tight">CROCKNESTCLUB</div>
      <div className="flex gap-2 items-center">
        <Button variant="ghost" size="icon"><LucideSearch /></Button>
        <Button variant="ghost" size="icon"><LucideShoppingCart /></Button>
        <Button variant="outline" className="ml-2">Sign In</Button>
      </div>
    </header>
  );
}
