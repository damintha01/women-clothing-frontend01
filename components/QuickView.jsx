"use client";
import { useEffect, useState } from "react";
import { X, Heart } from "lucide-react";
import { LKR } from "@/lib/shop-data";
import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";

export function QuickView({ product, onClose }) {
  const { addItem } = useCart();
  const { toggle, isWished } = useWishlist();
  const [detail, setDetail] = useState(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const open = Boolean(product);

  useEffect(() => {
    if (!product) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetail(null);
    setQty(1);
    fetch(`/api/products/${product.slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setDetail(data.product);
        setSize(data.product.sizes?.[0] ?? "");
        setColor(data.product.colors?.[0]?.name ?? "");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [product]);

  const variant = detail?.variants?.find(
    (v) => v.size === size && (color ? v.color === color : true),
  );

  async function handleAdd() {
    if (!detail || !variant) return;
    setAdding(true);
    try {
      await addItem(
        {
          productId: detail.id,
          variantId: variant.id,
          name: detail.name,
          price: detail.price,
          size,
          color,
          quantity: qty,
          image: detail.images?.[0]?.url,
        },
        detail.name,
      );
      onClose();
    } catch {
      // toast already shown by the cart context
    } finally {
      setAdding(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[85] flex items-center justify-center p-0 transition-opacity duration-500 md:p-8 ${open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
    >
      <div className="absolute inset-0 bg-charcoal/50" onClick={onClose} />
      {product && (
        <div
          className={`relative grid h-full w-full max-w-5xl grid-cols-1 overflow-y-auto bg-cream transition-transform duration-700 md:h-auto md:grid-cols-2 ${open ? "translate-y-0" : "translate-y-6"
            }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
        >
          <img
            src={product.images?.[0]?.url ?? product.image}
            alt={product.name}
            loading="lazy"
            width={900}
            height={1200}
            className="h-full w-full object-cover md:aspect-[3/4]"
          />
          <div className="relative p-8 md:p-12">
            <button aria-label="Close quick view" onClick={onClose} className="tap-target absolute right-6 top-6">
              <X className="size-5" strokeWidth={1.2} />
            </button>
            <p className="eyebrow text-rose">{product.badges?.[0] ?? "Edit"}</p>
            <h2 className="display mt-4 text-5xl">{product.name}</h2>
            <p className="mt-4 font-serif text-2xl">{LKR(product.price)}</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {(product.colors?.length ?? 0) > 0 && (
              <>
                <p className="eyebrow mt-8 text-muted-foreground">Colour</p>
                <div className="mt-3 flex gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      aria-label={c.name}
                      onClick={() => setColor(c.name)}
                      className={`size-6 rounded-full border transition-transform duration-500 ${color === c.name ? "scale-110 border-foreground" : "border-border"}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </>
            )}

            {(product.sizes?.length ?? 0) > 0 && (
              <>
                <div className="mt-8 flex items-center justify-between">
                  <p className="eyebrow text-muted-foreground">Size</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`size-11 border text-xs tracking-widest transition-colors duration-500 ${size === s ? "border-foreground bg-foreground text-cream" : "border-border hover:border-foreground"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center border border-border">
                <button className="px-4 py-3" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span className="w-8 text-center text-sm">{qty}</span>
                <button className="px-4 py-3" onClick={() => setQty((q) => q + 1)}>
                  +
                </button>
              </div>
              <button
                aria-label="Add to wishlist"
                onClick={() => toggle(product)}
                className="tap-target transition-transform duration-500 hover:scale-110"
              >
                <Heart
                  className={`size-5 ${isWished(product.id) ? "fill-burgundy text-burgundy" : ""}`}
                  strokeWidth={1.2}
                />
              </button>
            </div>

            <button
              className="btn-lux mt-8 w-full disabled:opacity-40"
              disabled={!detail || !variant || variant.inStock === false || adding}
              onClick={handleAdd}
            >
              {!detail ? "Loading…" : variant?.inStock === false ? "Out of stock" : adding ? "Adding…" : "Add to bag"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
