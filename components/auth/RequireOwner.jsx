"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

export function RequireOwner({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role !== "owner") {
      router.replace("/");
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || !user || user.role !== "owner") {
    return <div className="px-5 py-40 text-center eyebrow text-muted-foreground">Loading…</div>;
  }

  return children;
}
