"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/src/actions/auth";

export default function VerifyPage() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"pending"|"success"|"error">("pending");

  useEffect(() => {
    const token = params.get("token");
    if (!token) { setStatus("error"); return; }
    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [params]);

  if (status === "pending") return <div className="max-w-sm mx-auto mt-20">Verifying...</div>;
  if (status === "success") return <div className="max-w-sm mx-auto mt-20">Email verified. You can close this window.</div>;
  return <div className="max-w-sm mx-auto mt-20">Invalid or expired verification link.</div>;
}


