"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProductGrid } from "./ProductGrid";

export function SearchView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  useEffect(() => {
    if (!initialQuery) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(initialQuery)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setProducts(data.products);
        setTotal(data.pagination?.total ?? data.products.length);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialQuery]);

  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
      <Reveal>
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl items-center gap-3 border-b border-foreground/30 pb-4">
          <Search className="size-5 text-muted-foreground" strokeWidth={1.2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dresses, silk, linen…"
            className="w-full bg-transparent font-serif text-2xl outline-none placeholder:text-muted-foreground"
          />
        </form>
      </Reveal>

      {initialQuery && (
        <p className="mt-10 eyebrow text-muted-foreground">
          {isLoading ? "Searching…" : `${total} results for "${initialQuery}"`}
        </p>
      )}

      <div className="mt-10">
        {initialQuery && !isLoading && <ProductGrid products={products} emptyMessage="No pieces match your search." />}
      </div>
    </div>
  );
}
