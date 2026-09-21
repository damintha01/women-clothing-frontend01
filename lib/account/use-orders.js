"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/lib/toast";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders/my", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok) setOrders(data.orders);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cancelOrder = useCallback(async (id) => {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}/cancel`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not cancel this order.");
      setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel this order.");
    } finally {
      setMutatingId(null);
    }
  }, []);

  return { orders, isLoading, mutatingId, cancelOrder };
}
