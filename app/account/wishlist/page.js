"use client";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { WishlistItemRow } from "@/components/account/WishlistItemRow";
import { Reveal } from "@/components/Reveal";

export default function WishlistPage() {
  const { products, isLoading } = useWishlist();

  if (isLoading) return <p className="eyebrow text-muted-foreground">Loading…</p>;

  if (products.length === 0) {
    return (
      <Reveal>
        <p className="font-serif text-2xl text-muted-foreground">Your wishlist is empty.</p>
        <Link href="/shop" className="btn-lux mt-8 inline-flex">
          Discover Pieces
        </Link>
      </Reveal>
    );
  }

  return (
    <Reveal className="divide-y divide-border">
      {products.map((p) => (
        <WishlistItemRow key={p.id} product={p} />
      ))}
    </Reveal>
  );
}
