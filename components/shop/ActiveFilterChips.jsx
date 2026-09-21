"use client";
import { X } from "lucide-react";
import { hasActiveShopFilters } from "@/lib/shop/query-params";

export function ActiveFilterChips({ filters, setFilters, clearFilters }) {
  if (!hasActiveShopFilters(filters)) return null;

  const chips = [];
  if (filters.search) chips.push({ label: `"${filters.search}"`, clear: () => setFilters({ search: "" }) });
  if (filters.category) chips.push({ label: filters.category, clear: () => setFilters({ category: "" }) });
  if (filters.tag) chips.push({ label: filters.tag, clear: () => setFilters({ tag: "" }) });
  (filters.sizes ?? []).forEach((s) =>
    chips.push({ label: `Size ${s}`, clear: () => setFilters({ sizes: filters.sizes.filter((x) => x !== s) }) }),
  );
  (filters.colors ?? []).forEach((c) =>
    chips.push({ label: c, clear: () => setFilters({ colors: filters.colors.filter((x) => x !== c) }) }),
  );
  if (filters.minPrice != null || filters.maxPrice != null) {
    chips.push({
      label: `${filters.minPrice ?? 0} – ${filters.maxPrice ?? "∞"}`,
      clear: () => setFilters({ minPrice: null, maxPrice: null }),
    });
  }
  if (filters.inStock) chips.push({ label: "In stock", clear: () => setFilters({ inStock: false }) });

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={chip.clear}
          className="flex items-center gap-2 border border-border px-3 py-1.5 text-xs uppercase tracking-widest"
        >
          {chip.label} <X className="size-3" />
        </button>
      ))}
      <button onClick={clearFilters} className="eyebrow line-link text-muted-foreground">
        Clear all
      </button>
    </div>
  );
}
