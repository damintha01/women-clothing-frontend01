"use client";
import { Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";
import { LKR } from "@/lib/shop-data";
import { Reveal } from "@/components/Reveal";
import { ProductGallery } from "./ProductGallery";
import { AddToCartPanel } from "./AddToCartPanel";
import { ReviewsSection } from "./ReviewsSection";
import { RelatedProducts } from "./RelatedProducts";

const ICONS = [Truck, RotateCcw, ShieldCheck];

export function ProductDetailView({ product }) {
  return (
    <div>
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 pt-32 md:px-10 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <ProductGallery images={product.images} name={product.name} />
        </Reveal>

        <Reveal delay={120}>
          {product.badges.length > 0 && <p className="eyebrow text-rose">{product.badges[0]}</p>}
          <h1 className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">{product.name}</h1>

          <button
            onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Star className="size-4 fill-champagne text-champagne" strokeWidth={0} />
            {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
          </button>

          <div className="mt-6 flex items-baseline gap-3">
            <p className="font-serif text-3xl">{LKR(product.price)}</p>
            {product.compareAtPrice && (
              <p className="text-sm text-muted-foreground line-through">{LKR(product.compareAtPrice)}</p>
            )}
          </div>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <p className="mt-4 text-xs tracking-widest uppercase text-muted-foreground">
            {product.inStock ? "In stock" : "Out of stock"}
          </p>

          <AddToCartPanel product={product} />

          <div className="mt-12 space-y-6 border-t border-border pt-8">
            {product.delivery.map((d, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={d.label} className="flex gap-4">
                  <Icon className="mt-0.5 size-5 shrink-0 text-rose" strokeWidth={1.2} />
                  <div>
                    <p className="text-sm font-medium">{d.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{d.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>

      <ReviewsSection slug={product.slug} rating={product.rating} reviews={product.reviews} />
      <RelatedProducts products={product.relatedProducts} />
    </div>
  );
}
