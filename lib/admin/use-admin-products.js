"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/lib/toast";

export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products?limit=200", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok) setProducts(data.products);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeProduct = useCallback(async (id) => {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not delete this product.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete this product.");
    } finally {
      setMutatingId(null);
    }
  }, []);

  return { products, isLoading, mutatingId, removeProduct, reload: load };
}
