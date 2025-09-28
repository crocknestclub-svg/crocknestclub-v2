"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LucideMenu, LucideHome, LucideUser } from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around items-center py-2 z-50 md:hidden">
      <Button variant="ghost" size="icon"><LucideHome /></Button>
      <Button variant="ghost" size="icon"><LucideUser /></Button>
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}><LucideMenu /></Button>
      {/* Drawer/modal for menu can be added here */}
    </nav>
  );
}
