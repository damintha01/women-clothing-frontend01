"use client";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { QuickView } from "@/components/QuickView";

export function RelatedProducts({ products }) {
  const [quick, setQuick] = useState(null);
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
      <p className="eyebrow text-rose">Complete the look</p>
      <h2 className="display mt-4 text-4xl">You may also like</h2>
      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={i * 80}>
            <ProductCard product={p} onQuickView={setQuick} />
          </Reveal>
        ))}
      </div>
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </section>
  );
}
