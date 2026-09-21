"use client";
import { useEffect, useState } from "react";

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [statsRes, lowStockRes] = await Promise.all([
          fetch("/api/admin/dashboard", { cache: "no-store" }),
          fetch("/api/admin/products/low-stock", { cache: "no-store" }),
        ]);
        if (cancelled) return;
        if (statsRes.ok) setStats(await statsRes.json());
        if (lowStockRes.ok) setLowStock((await lowStockRes.json()).products);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, lowStock, isLoading };
}
