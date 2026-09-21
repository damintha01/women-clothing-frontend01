"use client";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { QuickView } from "@/components/QuickView";

export function ProductGrid({ products, emptyMessage = "No pieces found." }) {
  const [quick, setQuick] = useState(null);

  if (products.length === 0) {
    return <p className="py-16 text-center font-serif text-2xl text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 6) * 80}>
            <ProductCard product={p} onQuickView={setQuick} />
          </Reveal>
        ))}
      </div>
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  );
}
