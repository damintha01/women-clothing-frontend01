"use client";
import { useEffect, useMemo, useState } from "react";
import { filterProducts, sortProducts, paginateProducts, buildProductFacets } from "./product-query";
import { SHOP_PAGE_SIZE } from "./query-params";

/** Fetches the full catalog once, then filters/sorts/paginates it client-side per `filters`. */
export function useProducts(filters) {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/products?limit=200", { cache: "no-store" });
        if (!response.ok) throw new Error("Could not load products.");
        const data = await response.json();
        if (!cancelled) setAllProducts(data.products);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load products.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const facets = useMemo(() => buildProductFacets(allProducts), [allProducts]);

  const filtered = useMemo(() => filterProducts(allProducts, filters), [allProducts, filters]);
  const sorted = useMemo(() => sortProducts(filtered, filters.sort), [filtered, filters.sort]);
  const page = filters.page ?? 1;
  const items = useMemo(() => paginateProducts(sorted, page, SHOP_PAGE_SIZE), [sorted, page]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / SHOP_PAGE_SIZE));

  return { items, total: sorted.length, page, totalPages, facets, isLoading, error };
}
