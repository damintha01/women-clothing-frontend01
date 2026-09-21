"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { VariantSelector } from "./VariantSelector";
import { QuantityStepper } from "./QuantityStepper";

export function AddToCartPanel({ product }) {
  const { addItem } = useCart();
  const { toggle, isWished } = useWishlist();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const variant = product.variants.find((v) => v.size === size && (color ? v.color === color : true));
  const wished = isWished(product.id);

  async function handleAdd() {
    if (!variant) return;
    setAdding(true);
    try {
      await addItem(
        {
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          price: variant.price ?? product.price,
          size,
          color,
          quantity: qty,
          image: product.images?.[0]?.url,
        },
        product.name,
      );
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <VariantSelector product={product} size={size} color={color} onSizeChange={setSize} onColorChange={setColor} />

      <div className="mt-8 flex items-center gap-6">
        <QuantityStepper value={qty} onChange={setQty} max={variant?.stock ?? 10} />
        <button aria-label="Add to wishlist" onClick={() => toggle(product)} className="transition-transform duration-500 hover:scale-110">
          <Heart className={`size-5 ${wished ? "fill-burgundy text-burgundy" : ""}`} strokeWidth={1.2} />
        </button>
      </div>

      <button
        className="btn-lux mt-8 w-full disabled:opacity-40"
        disabled={!variant || variant.inStock === false || adding}
        onClick={handleAdd}
      >
        {!product.inStock ? "Out of stock" : !variant ? "Select options" : adding ? "Adding…" : "Add to bag"}
      </button>
    </div>
  );
}
