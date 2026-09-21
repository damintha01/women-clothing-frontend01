"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProductGrid } from "./ProductGrid";
import { useShopFilters } from "@/lib/shop/use-shop-filters";
import { useProducts } from "@/lib/shop/use-products";
import { ShopToolbar } from "./ShopToolbar";
import { ShopFilterPanel } from "./ShopFilterPanel";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { ShopPagination } from "./ShopPagination";

export function ShopView() {
  const { filters, setFilters, clearFilters } = useShopFilters();
  const { items, total, page, totalPages, facets, isLoading, error } = useProducts(filters);
  const [mobileFilters, setMobileFilters] = useState(false);

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
      <Reveal className="mb-10">
        <p className="eyebrow text-rose">Shop</p>
        <h1 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)]">Every Piece</h1>
      </Reveal>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <ShopFilterPanel facets={facets} filters={filters} setFilters={setFilters} className="hidden lg:block" />

        <div>
          <ShopToolbar filters={filters} setFilters={setFilters} total={total} onOpenFilters={() => setMobileFilters(true)} />
          <ActiveFilterChips filters={filters} setFilters={setFilters} clearFilters={clearFilters} />

          {error && <p className="py-16 text-center text-sm text-destructive">{error}</p>}
          {!error && isLoading && <p className="py-16 text-center eyebrow text-muted-foreground">Loading…</p>}

          {!error && !isLoading && (
            <div className="pt-10">
              <ProductGrid products={items} emptyMessage="No pieces match these filters." />
            </div>
          )}

          <ShopPagination page={page} totalPages={totalPages} setFilters={setFilters} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={`fixed inset-0 z-[90] bg-charcoal/40 transition-opacity duration-500 lg:hidden ${mobileFilters ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileFilters(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-[95] w-full max-w-xs overflow-y-auto bg-cream p-6 transition-transform duration-700 lg:hidden ${mobileFilters ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="eyebrow">Filters</p>
          <button aria-label="Close filters" onClick={() => setMobileFilters(false)}>
            <X className="size-5" strokeWidth={1.2} />
          </button>
        </div>
        <ShopFilterPanel facets={facets} filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
}
