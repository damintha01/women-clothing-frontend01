"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

export function RequireGuest({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && user) {
      const redirect = searchParams.get("redirect");
      router.replace(user.role === "owner" ? "/admin" : redirect || "/account/profile");
    }
  }, [isLoading, user, router, searchParams]);

  if (isLoading || user) {
    return <div className="px-5 py-40 text-center eyebrow text-muted-foreground">Loading…</div>;
  }

  return children;
}
