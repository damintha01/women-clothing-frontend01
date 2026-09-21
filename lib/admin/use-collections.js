"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/lib/toast";

export function useAdminCollections() {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/collections", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok) setCollections(data.collections);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createCollection = useCallback(async (input) => {
    const res = await fetch("/api/admin/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(data?.error?.message ?? "Could not create this collection.");
      throw new Error(data?.error?.message);
    }
    setCollections((prev) => [...prev, data.collection]);
    toast.success("Collection created");
  }, []);

  const updateCollection = useCallback(async (id, input) => {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not update this collection.");
      setCollections((prev) => prev.map((c) => (c.id === id ? data.collection : c)));
      toast.success("Collection updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update this collection.");
      throw err;
    } finally {
      setMutatingId(null);
    }
  }, []);

  const removeCollection = useCallback(async (id) => {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not delete this collection.");
      setCollections((prev) => prev.filter((c) => c.id !== id));
      toast.success("Collection deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete this collection.");
    } finally {
      setMutatingId(null);
    }
  }, []);

  return { collections, isLoading, mutatingId, createCollection, updateCollection, removeCollection };
}
