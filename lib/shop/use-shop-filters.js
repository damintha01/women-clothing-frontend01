"use client";
import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { parseShopSearchParams, shopFiltersToQueryString } from "./query-params";

/** Keeps shop filter state synced to the URL so filtered views are shareable/bookmarkable. */
export function useShopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => parseShopSearchParams(searchParams), [searchParams]);

  const setFilters = useCallback(
    (next) => {
      const merged = { ...filters, ...next };
      // Any filter change other than the page itself resets pagination.
      if (!("page" in next)) merged.page = 1;
      const query = shopFiltersToQueryString(merged);
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [filters, pathname, router],
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return { filters, setFilters, clearFilters };
}
