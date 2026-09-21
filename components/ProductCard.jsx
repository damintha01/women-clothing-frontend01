"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { LKR } from "@/lib/shop-data";
import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { fetchDefaultVariant, toCartInput } from "@/lib/cart/quick-add";

export function ProductCard({
  product,
  onQuickView,
  className = "",
}) {
  const { addItem } = useCart();
  const { toggle, isWished } = useWishlist();
  const [adding, setAdding] = useState(false);
  const wished = isWished(product.id);

  const image = product.images?.[0]?.url ?? product.image;
  const hoverImage = product.images?.[1]?.url ?? image;
  const badge = product.badges?.[0];

  async function handleQuickAdd() {
    setAdding(true);
    try {
      const match = await fetchDefaultVariant(product.slug);
      if (!match) return;
      await addItem(toCartInput(match.detail, match.variant), match.detail.name);
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className={`group ${className}`}>
      <div className="relative overflow-hidden bg-secondary">
        <Link href={`/shop/${product.slug}`}>
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            width={900}
            height={1200}
            className="aspect-[3/4] w-full object-cover transition-opacity duration-700 group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 aspect-[3/4] w-full scale-105 object-cover opacity-0 transition-all duration-[1200ms] group-hover:scale-100 group-hover:opacity-100"
            style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
          />
        </Link>

        {badge && (
          <span className="absolute left-4 top-4 bg-cream/90 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase">
            {badge}
          </span>
        )}

        <button
          aria-label="Add to wishlist"
          onClick={() => toggle(product)}
          className="absolute right-4 top-4 grid size-9 place-items-center bg-cream/90 transition-transform duration-500 hover:scale-110"
        >
          <Heart
            className={`size-4 transition-colors duration-500 ${wished ? "fill-burgundy text-burgundy" : ""}`}
            strokeWidth={1.2}
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-px opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleQuickAdd}
            disabled={adding}
            className="flex-1 bg-charcoal py-4 text-[10px] tracking-[0.22em] uppercase text-cream transition-colors duration-500 hover:bg-burgundy disabled:opacity-60"
          >
            {adding ? "Adding…" : "Quick add"}
          </button>
          <button
            onClick={() => onQuickView && onQuickView(product)}
            className="flex-1 bg-cream py-4 text-[10px] tracking-[0.22em] uppercase transition-colors duration-500 hover:bg-blush"
          >
            View details
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-serif text-2xl leading-tight">{product.name}</h3>
          </Link>
          <div className="mt-3 flex gap-2">
            {(product.colors ?? []).map((c) => (
              <span key={c.name} className="size-3 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        </div>
        <p className="whitespace-nowrap text-sm">{LKR(product.price)}</p>
      </div>
    </article>
  );
}
