"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { registerUser } from "@/src/actions/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerUser({ name, email, password });
      const res = await signIn("credentials", { redirect: false, email, password });
      setLoading(false);
      if (res?.error) setError(res.error);
      if (res?.ok) window.location.href = "/";
      return;
    } catch (e: unknown) {
      setError((e as Error).message ?? "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Button variant="outline" className="w-full" onClick={() => signIn("google")}>Sign up with Google</Button>
      </div>
    </div>
  );
}
