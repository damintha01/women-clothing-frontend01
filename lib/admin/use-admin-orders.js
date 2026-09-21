"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/lib/toast";

export function useAdminOrders(status) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = status ? `/api/admin/orders?status=${status}` : "/api/admin/orders";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok) setOrders(data.orders);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = useCallback(async (id, newStatus) => {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not update this order.");
      setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
      toast.success("Order updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update this order.");
    } finally {
      setMutatingId(null);
    }
  }, []);

  const refundOrder = useCallback(async (id) => {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}/refund`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not refund this order.");
      setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
      toast.success("Order refunded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not refund this order.");
    } finally {
      setMutatingId(null);
    }
  }, []);

  return { orders, isLoading, mutatingId, updateStatus, refundOrder };
}
