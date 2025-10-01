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

  const isVerified = Boolean((session.user as unknown as { emailVerified: Date | null })?.emailVerified);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      {!isVerified && (
        <div className="mb-4 p-3 rounded border border-amber-300 bg-amber-50 text-amber-900">
          Please verify your email to unlock all features. Check your inbox.
        </div>
      )}
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
