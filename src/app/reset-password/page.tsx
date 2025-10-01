"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/src/actions/auth";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setMessage("Passwords do not match"); return; }
    setLoading(true);
    setMessage("");
    try {
      await resetPassword({ token, password });
      setMessage("Password updated. You can sign in now.");
    } catch {
      setMessage("Invalid or expired link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <Input type="password" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
        <Button type="submit" disabled={loading} className="w-full">{loading ? "Updating..." : "Update Password"}</Button>
      </form>
      {message && <div className="mt-3 text-sm">{message}</div>}
    </div>
  );
}


