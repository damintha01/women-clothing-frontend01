"use client";
import Link from "next/link";
import { X } from "lucide-react";
import { LKR } from "@/lib/shop-data";
import { useCart } from "@/lib/cart/cart-context";

const FREE_SHIPPING = 20000;

export function CartDrawer() {
  const { cart, isDrawerOpen, closeDrawer, removeItem } = useCart();
  const progress = Math.min(100, (cart.subtotal / FREE_SHIPPING) * 100);

  return (
    <>
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-[70] bg-charcoal/40 transition-opacity duration-500 ${
          isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-[80] flex h-full w-full max-w-[440px] flex-col bg-cream transition-transform duration-700 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-6">
          <h2 className="eyebrow">Shopping bag ({cart.items.length})</h2>
          <button aria-label="Close bag" onClick={closeDrawer} className="tap-target">
            <X className="size-5" strokeWidth={1.2} />
          </button>
        </div>

        <div className="border-b border-border px-6 py-4">
          <p className="text-[11px] tracking-widest uppercase text-muted-foreground">
            {cart.subtotal >= FREE_SHIPPING
              ? "Free island-wide shipping unlocked"
              : `${LKR(FREE_SHIPPING - cart.subtotal)} away from free shipping`}
          </p>
          <div className="mt-3 h-px w-full bg-border">
            <div className="h-px bg-rose transition-[width] duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {cart.items.length === 0 && (
            <p className="mt-16 text-center font-serif text-2xl text-muted-foreground">Your bag is empty.</p>
          )}
          {cart.items.map((line) => (
            <div key={line.id} className="flex gap-4 border-b border-border py-6">
              {line.image && (
                <img
                  src={line.image}
                  alt={line.name}
                  loading="lazy"
                  width={900}
                  height={1200}
                  className="h-32 w-24 object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-serif text-xl leading-tight">{line.name}</p>
                <p className="mt-1 text-[11px] tracking-widest uppercase text-muted-foreground">
                  {[line.size, line.color].filter(Boolean).join(" · ")}
                  {line.size || line.color ? " · " : ""}Qty {line.quantity}
                </p>
                <p className="mt-3 text-sm">{LKR(line.price * line.quantity)}</p>
                <button
                  onClick={() => removeItem(line.id, line.name)}
                  className="eyebrow line-link mt-3 text-muted-foreground"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-6 py-6">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Subtotal</span>
            <span className="font-serif text-2xl">{LKR(cart.subtotal)}</span>
          </div>
          <Link href="/checkout" onClick={closeDrawer} className="btn-lux mt-5 w-full justify-center">
            Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}
