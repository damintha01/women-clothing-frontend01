"use client";
import { LKR } from "@/lib/shop-data";

export function ShopFilterPanel({ facets, filters, setFilters, className = "" }) {
  function toggleInArray(key, value) {
    const current = filters[key] ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setFilters({ [key]: next });
  }

  return (
    <div className={className}>
      {facets.categories.length > 0 && (
        <div className="border-b border-border pb-6">
          <p className="eyebrow mb-4 text-muted-foreground">Category</p>
          <div className="space-y-2">
            {facets.categories.map((c) => (
              <label key={c.slug} className="flex items-center gap-3 text-sm">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === c.slug}
                  onChange={() => setFilters({ category: filters.category === c.slug ? "" : c.slug })}
                />
                {c.label} <span className="text-muted-foreground">({c.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {facets.sizes.length > 0 && (
        <div className="border-b border-border py-6">
          <p className="eyebrow mb-4 text-muted-foreground">Size</p>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => (
              <button
                key={s}
                onClick={() => toggleInArray("sizes", s)}
                className={`size-10 border text-xs tracking-widest transition-colors duration-500 ${
                  filters.sizes?.includes(s) ? "border-foreground bg-foreground text-cream" : "border-border hover:border-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {facets.colors.length > 0 && (
        <div className="border-b border-border py-6">
          <p className="eyebrow mb-4 text-muted-foreground">Colour</p>
          <div className="flex flex-wrap gap-3">
            {facets.colors.map((c) => (
              <button
                key={c.name}
                aria-label={c.name}
                onClick={() => toggleInArray("colors", c.name)}
                className={`size-7 rounded-full border transition-transform duration-500 ${
                  filters.colors?.includes(c.name) ? "scale-110 border-foreground" : "border-border"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="border-b border-border py-6">
        <p className="eyebrow mb-4 text-muted-foreground">Price</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder={LKR(facets.priceRange.min)}
            value={filters.minPrice ?? ""}
            onChange={(e) => setFilters({ minPrice: e.target.value ? Number(e.target.value) : null })}
            className="w-full border border-border bg-transparent px-3 py-2 text-sm outline-none"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            placeholder={LKR(facets.priceRange.max)}
            value={filters.maxPrice ?? ""}
            onChange={(e) => setFilters({ maxPrice: e.target.value ? Number(e.target.value) : null })}
            className="w-full border border-border bg-transparent px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 py-6 text-sm">
        <input
          type="checkbox"
          checked={Boolean(filters.inStock)}
          onChange={(e) => setFilters({ inStock: e.target.checked })}
        />
        In stock only
      </label>
    </div>
  );
}
