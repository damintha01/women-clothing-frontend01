"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { categories } from "@/lib/shop-data";

export function CategoryShowcase() {
  const images = [
    "/assets/collection-1.jpg",
    "/assets/collection-3.jpg",
    "/assets/collection-2.jpg",
    "/assets/look.jpg",
    "/assets/editorial.jpg",
    "/assets/story.jpg"
  ];
  return (
    <section className="bg-cream py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-rose">Wardrobe</p>
              <h2 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)]">Shop by category</h2>
            </div>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Reveal key={c} delay={i * 80}>
              <Link href={`/shop?category=${encodeURIComponent(c.toLowerCase())}`} className="zoom-media group relative block">
                <img src={images[i]} alt={c} loading="lazy" width={900} height={1200} className="aspect-[3/4] w-full object-cover" />
                <div className="absolute inset-0 bg-charcoal/20 transition-colors duration-700 group-hover:bg-rose/40" />
                <span className="absolute bottom-5 left-5 font-serif text-2xl text-cream transition-transform duration-700 group-hover:-translate-y-1">
                  {c}
                </span>
                <ArrowUpRight className="absolute bottom-5 right-5 size-5 translate-y-2 text-cream opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100" strokeWidth={1} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
