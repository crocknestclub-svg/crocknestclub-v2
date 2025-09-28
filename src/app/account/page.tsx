"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

declare module "next-auth" {
  interface User {
    role?: string;
  }
}

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in to view your account.</div>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Account</h2>
      <div className="mb-2">Name: {session.user?.name ?? "N/A"}</div>
      <div className="mb-2">Email: {session.user?.email ?? "N/A"}</div>
      {session.user?.role && (
        <div className="mb-2">Role: {session.user.role}</div>
      )}
      <Button variant="outline" onClick={() => window.location.href = "/api/auth/signout"}>Sign Out</Button>
    </div>
  );
}
