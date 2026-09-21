"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/lib/toast";

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users/me/addresses", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok) setAddresses(data.addresses);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addAddress = useCallback(async (input) => {
    const res = await fetch("/api/users/me/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(data?.error?.message ?? "Could not add this address.");
      throw new Error(data?.error?.message);
    }
    setAddresses(data.addresses);
    toast.success("Address added");
  }, []);

  const updateAddress = useCallback(async (id, input) => {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/users/me/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not update this address.");
      setAddresses(data.addresses);
      toast.success("Address updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update this address.");
      throw err;
    } finally {
      setMutatingId(null);
    }
  }, []);

  const removeAddress = useCallback(async (id) => {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/users/me/addresses/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not remove this address.");
      setAddresses(data.addresses);
      toast.success("Address removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove this address.");
    } finally {
      setMutatingId(null);
    }
  }, []);

  const setDefaultAddress = useCallback(async (id) => {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/users/me/addresses/${id}/default`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not set default address.");
      setAddresses(data.addresses);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not set default address.");
    } finally {
      setMutatingId(null);
    }
  }, []);

  return { addresses, isLoading, mutatingId, addAddress, updateAddress, removeAddress, setDefaultAddress };
}
