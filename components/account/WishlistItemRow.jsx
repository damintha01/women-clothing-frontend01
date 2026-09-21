"use client";
import { useState } from "react";
import Link from "next/link";
import { LKR } from "@/lib/shop-data";
import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { fetchDefaultVariant, toCartInput } from "@/lib/cart/quick-add";

export function WishlistItemRow({ product }) {
  const { addItem } = useCart();
  const { toggle } = useWishlist();
  const [moving, setMoving] = useState(false);

  async function handleMoveToBag() {
    setMoving(true);
    try {
      const match = await fetchDefaultVariant(product.slug);
      if (!match) return;
      await addItem(toCartInput(match.detail, match.variant), match.detail.name);
      await toggle(product);
    } finally {
      setMoving(false);
    }
  }

  return (
    <div className="flex items-center gap-4 border-b border-border py-6">
      <Link href={`/shop/${product.slug}`}>
        <img src={product.images?.[0]?.url} alt={product.name} className="h-28 w-20 object-cover" />
      </Link>
      <div className="flex-1">
        <Link href={`/shop/${product.slug}`} className="font-serif text-xl leading-tight">
          {product.name}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{LKR(product.price)}</p>
      </div>
      <button onClick={handleMoveToBag} disabled={moving} className="btn-ghost-lux text-xs">
        <span>{moving ? "Moving…" : "Move to Bag"}</span>
      </button>
      <button onClick={() => toggle(product)} className="eyebrow line-link text-muted-foreground">
        Remove
      </button>
    </div>
  );
}
