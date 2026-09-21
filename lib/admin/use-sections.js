"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/lib/toast";

export function useSections() {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/sections", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok) setSections(data.sections.sort((a, b) => a.order - b.order));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createSection = useCallback(async (input) => {
    const res = await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(data?.error?.message ?? "Could not create this section.");
      throw new Error(data?.error?.message);
    }
    setSections((prev) => [...prev, data.section].sort((a, b) => a.order - b.order));
    toast.success("Section created");
  }, []);

  const updateSection = useCallback(async (id, input) => {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/admin/sections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not update this section.");
      setSections((prev) => prev.map((s) => (s.id === id ? data.section : s)).sort((a, b) => a.order - b.order));
      toast.success("Section updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update this section.");
      throw err;
    } finally {
      setMutatingId(null);
    }
  }, []);

  const removeSection = useCallback(async (id) => {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/admin/sections/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not delete this section.");
      setSections((prev) => prev.filter((s) => s.id !== id));
      toast.success("Section deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete this section.");
    } finally {
      setMutatingId(null);
    }
  }, []);

  return { sections, isLoading, mutatingId, createSection, updateSection, removeSection };
}
