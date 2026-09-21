"use client";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
];

export function ShopToolbar({ filters, setFilters, total, onOpenFilters }) {
  const [search, setSearch] = useState(filters.search);

  useEffect(() => setSearch(filters.search), [filters.search]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (search !== filters.search) setFilters({ search });
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-border pb-6">
      <button
        onClick={onOpenFilters}
        className="flex items-center gap-2 border border-border px-4 py-2.5 text-xs tracking-widest uppercase lg:hidden"
      >
        <SlidersHorizontal className="size-3.5" strokeWidth={1.2} /> Filters
      </button>

      <div className="flex min-w-[200px] flex-1 items-center gap-2 border-b border-border pb-2">
        <Search className="size-4 text-muted-foreground" strokeWidth={1.2} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search this collection…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <p className="text-xs tracking-widest uppercase text-muted-foreground">{total} pieces</p>

      <select
        value={filters.sort}
        onChange={(e) => setFilters({ sort: e.target.value })}
        className="border border-border bg-transparent px-3 py-2.5 text-xs tracking-widest uppercase outline-none"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
