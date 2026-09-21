"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/lib/toast";

/** Handles both create (`id` undefined) and edit (`id` given) modes, plus variant + image CRUD. */
export function useAdminProduct(id) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok) setProduct(data.product);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (input) => {
      setSaving(true);
      try {
        const url = id ? `/api/admin/products/${id}` : "/api/admin/products";
        const res = await fetch(url, {
          method: id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error?.message ?? "Could not save this product.");
        toast.success(id ? "Product updated" : "Product created");
        return data.product;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not save this product.");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [id],
  );

  const addVariant = useCallback(
    async (variant) => {
      const res = await fetch(`/api/admin/products/${id}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variant),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error?.message ?? "Could not add this variant.");
        return;
      }
      setProduct(data.product);
    },
    [id],
  );

  const updateVariantStock = useCallback(
    async (variantId, stock) => {
      const res = await fetch(`/api/admin/products/${id}/variants`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stock }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error?.message ?? "Could not update stock.");
        return;
      }
      setProduct(data.product);
    },
    [id],
  );

  const removeVariant = useCallback(
    async (variantId) => {
      const res = await fetch(`/api/admin/products/${id}/variants`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error?.message ?? "Could not remove this variant.");
        return;
      }
      setProduct(data.product);
      toast.success("Variant removed");
    },
    [id],
  );

  const uploadImage = useCallback(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload?folder=barracks/products", {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(data?.error?.message ?? "Could not upload this image.");
      return null;
    }
    return data.image;
  }, []);

  return { product, isLoading, saving, save, addVariant, updateVariantStock, removeVariant, uploadImage, reload: load };
}
